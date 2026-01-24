---
title: "Monitoring My Kegerator With Sensu"
date: 2018-04-28T04:58:16Z
description: ""
slug: "monitoring-my-kegerator-with-sensu"
draft: false
---

It's been a long time coming, but I've finally got the [KegPi][1] *mostly* working and being monitored with [Sensu][2]! This post is going to go over the whole kit and caboodle and is going to build on the posts of [creating  the kegerator][3] and [getting Sensu to run on a Raspberry Pi][4]. The deep and dark part of this post will cover:

* The code to measure the temp/contact sensors (Sensu Plugin)
* Writing Sensu checks that will incorporate that code
* Exporting the data from the temp sensor to [Graphite][5] and [InfluxDB][6] for seeing temperature trends

# Writing the Plugins
If you haven't had a chance to read the previous post on using Sensu to monitor Raspberry Pis, I'll give you a short blurb about Sensu. It's an open-source monitoring framework that allows you to monitor everything from fleets of servers and networking equipment to applications, and even yes, Raspberry Pis. It also has a highly decoupled architecture and relies on [plugins][7] to extend its functionality.

Currently there aren't any plugins inside of the Sensu ecosystem that exist for monitoring components that would be hooked up to a Raspberry Pi. So, I decided to write a few! 

_WARNING: I don't write a whole lot of Ruby professionally, and it's likely pretty UGLY code, but what the hell. It works, so let's just go with it! Also, your mileage may vary if you decide to put something like this together and use my code._

To get started writing a plugin, Sensu provides some skeletons for writing code in various languages:

* [Ruby][8]
* [Python][9]
* [Powershell* (not Sensu-provided, but does give a good idea of plugins written in Powershell)][10]

Before I'd started working at Sensu, the KegPi project was something that I tried to do from the ground up. I realized that the monitoring portion wasn't something that I wanted to write from scratch and tools (like Sensu) already existed, hence why I wrote the plugin for it. 

One quick note--by design, this plugin and the checks are designed to be fairly generic. What that means practically is that even though I'm using this primarily for a Raspberry Pi hooked up to a kegerator, you can use these checks in any sort of context. Have a Raspi that's monitoring the temp of a chicken coop? You can use this plugin. Want to [build security system for your kid's school locker][11] and use Sensu to handle the alerts? You can use this plugin to do it!

So let's take a look at a couple of the checks that are part of the plugin.

## Status Checks
### Contact Sensor Check
The contact sensor check is, again, designed to be generic and able to be used in a variety of circumstances. Here's the code:

```
require 'sensu-plugin/check/cli'
require 'rpi_gpio'

# Starting check class
class CheckContactSensor < Sensu::Plugin::Check::CLI
  option  :pinnum,
          short: '-p PINNUM',
          long: '--pin-num PINNUM',
          description: 'Sets the pin number the contact sensor is attached to',
          proc: proc(&:to_i),
          required: true

  option  :boardnum,
          short: '-b BOARDNUM',
          long: '--board-num BOARDNUM',
          description: 'Sets the board numbering type to either :bcm or :board',
          default: :bcm

  def initialize
    super
    RPi::GPIO.set_numbering config[:boardnum]
    RPi::GPIO.setup config[:pinnum], as: 'input', pull: 'up'
  end

  def run
    if RPi::GPIO.high? config[:pinnum]
      puts 'Contact sensor is open!'
      exit(2)
    else
      puts 'Contact sensor is closed.'
      exit(0)
    end
  end
end
```

We've got an option to set our pin and our board numbering options (those coming from [Clockvapor's ruby port of rpi.gpio][12]). So when we write our check (see below), we can add these options to the check.

### Temp Sensor Check
Working with the temp in Python examples was a bit of a challenge and much of that code I was able to translate into Ruby for the purpose of this particular check. Let's take a look:

```
require 'sensu-plugin/check/cli'
require 'rpi_gpio'

# Starting check class
class CheckTempSensor < Sensu::Plugin::Check::CLI
  option  :fahrenheit,
          short: '-F',
          long: '--fahrenheit',
          description: 'Return temperature in Fahrenheit'

  option  :celsius,
          short: '-C',
          long: '--celsius',
          description: 'Return temperature in Celsius'

  option  :tcrit,
          short: '-c TEMP',
          long: '--critical',
          proc: proc(&:to_i),
          description: 'Critical if TEMP greater than set value'

  option  :twarn,
          short: '-w TEMP',
          long: '--warn',
          proc: proc(&:to_i),
          description: 'Warning if TEMP greater than set value'

  # Set up variables
  def initialize
    super
    system('modprobe w1-gpio')
    system('modprobe w1-therm')
    @basedir = '/sys/bus/w1/devices/'.freeze
    @device_folder = Dir.glob(@basedir + '28*')[0]
    @device_file = @device_folder + '/w1_slave'
  end

  def read_temp
    lines = File.read(@device_file)
    while lines[0][-4..-2] != 'YES'
      sleep 0.2
      lines = File.readlines(@device_file)
    end

    equals_pos = lines[1].index('t=')
    return if equals_pos == -1

    lines[1][equals_pos + 2..-1].chomp.to_f / 1000.0
  end

  def temp_to_fahrenheit
    read_temp * 9.0 / 5.0 + 32.0
  end

  def temp_status
    critmsg = 'Temp is critical'
    warnmsg = 'Temp is abnormal'
    okmsg = 'Temp is OK'
    if config[:celsius] && read_temp > config[:tcrit]
      puts critmsg
      exit(2)
    elsif config[:celsius] && read_temp.between?(config[:tcrit], config[:twarn])
      puts warnmsg
      exit(1)
    elsif config[:fahrenheit] && temp_to_fahrenheit > config[:tcrit]
      puts critmsg
      exit(2)
    elsif config[:fahrenheit] && temp_to_fahrenheit.between?(config[:tcrit], config[:twarn])
      puts warnmsg
      exit(1)
    else
      puts okmsg
      exit(0)
    end
  end

  def run
    if config[:fahrenheit]
      puts 'Current Temp: ' + temp_to_fahrenheit.round(2).to_s + ' Fahrenheit'
    else
      puts 'Current Temp: ' + read_temp.round(2).to_s + ' Celsius'
    end
    temp_status
  end
end
```

Yikes! Yeah, that's a lot, but it boils down to a few key options you can include in a check:

* Celsius
* Fahrenheit
* Warning temp
* Critical temp

Again, this check can be super-generic, and it's got the option for Celsius, so what's not to love?

Alright, so one last check to take a look at as an example...metrics!

### Temp Sensor Metric Check
So this particular check is SUPER useful if you want to see your temp trends over time. It looks like this:

```
  # Set up variables
  def initialize
    super
    system('modprobe w1-gpio')
    system('modprobe w1-therm')
    @basedir = '/sys/bus/w1/devices/'.freeze
    @device_folder = Dir.glob(@basedir + '28*')[0]
    @device_file = @device_folder + '/w1_slave'
  end

  def read_temp
    lines = File.read(@device_file)
    while lines[0][-4..-2] != 'YES'
      sleep 0.2
      lines = File.readlines(@device_file)
    end

    equals_pos = lines[1].index('t=')
    return if equals_pos == -1

    lines[1][equals_pos + 2..-1].chomp.to_f / 1000.0
  end

  def temp_to_fahrenheit
    read_temp * 9.0 / 5.0 + 32.0
  end

  def run
    timestamp = Time.now.to_i

    if config[:celsius]
      ok output "#{config[:scheme]}", read_temp.round(2)
    else
      ok output "#{config[:scheme]}", temp_to_fahrenheit.round(2)
    end
  end
end
```

When we write a metric check in Sensu, this won't be a "status" type check (think "up" or "down", or "OH CRAP THIS THRESHHOLD'S BEEN HIT"), but more of a "here's the data" type check. Cool, so now that that's all out of the way, let's talk about the cool part, writing our checks.

# Writing the Checks
Sensu's check definitions are all written in JSON (trust me, I know the pains of trailing or missing commas). So when we write a check for the KegPi, we'll have to write this all in JSON and it's SUPER CRAZY IMPORTANT that you have the check scripts living on your Pi. To do that, just do the following:

`git clone https://github.com/asachs01/sensu-plugins-rpi-sensors.git`

Cool, done? Awesome. 

So let's take a look at three checks that correspond to the scripts I shared:

_**check-temp-sensor**_

```
{
	"checks": {
		"check-temp-sensor": {
			"command": "/home/pi/Documents/sensu-plugins-rpi-sensors/bin/check-temp-sensor.rb -F -w 45 -c 60",
			"interval": 15,
			"subscribers": ["kegpi"],
			"handlers": ["email", "slack"],
			"occurrences": 3,
			"refresh": 600
		}
	}
}
```

_**check-contact-sensor**_

```
{
	"checks": {
		"check-contact-sensor": {
			"command": "sudo /home/pi/Documents/scratchpad_kegpi/bin/check-contact-sensor.rb -p 22",
			"interval": 10,
			"occurrences": 8,
			"refresh": 120,
			"subscribers": ["kegpi"],
			"contacts": ["aaron"],
			"handlers": ["slack"]
		}
	}
}
```

_**metrics-temp-sensor**_

```
{
	"checks": {
		"metrics-temp-sensor": {
			"command": "/home/pi/Documents/sensu-plugins-rpi-sensors/bin/metrics-temp-sensor.rb -F",
			"type": "metric",
			"interval": 15,
			"metrics-temp": "<URL TO GRAPHITE GRAPH>",
			"subscribers": ["kegpi"],
			"handlers": ["graphite"]
		}
	}
}
```

Those are what the checks look like on a practical level. You'll notice the `contact` attribute is present in these checks. That's because I'm running a Sensu Enterprise deployment and taking advantage of contact routing...even though I'm the only one monitoring the kegerator. <insert shrug here>


So there you have it--some working checks that are at this point in time, checking the contact and temperature sensors attached ot the Pi. 
# Sending the Data to Other Sources
Before I wrap this up, let's do a quick discussion about how you can send the data to other sources and get some cool graphs out of the deal. Personally, I have the data being sent to two sources: an InfluxDB instance and a Graphite instance. The reason for exporting to two data sources simply comes down to the fact that I can perform a quick bit of magic in my check and embed my Graphite graph into my check for a quick visualization of the temperature. Also, I much prefer the graphs I can get out of Influx, but alas, those aren't embeddable. 

So how does the data make it to the Graphite and InfluxDB instances? Enter our handlers. You'll notice in the checks defined above, I have my influxdb and graphite handlers specified. Just like everything else in Sensu, this is done via JSON configuration files:

Our Graphite configuration;
_**/etc/sensu/conf.d/graphite.json**_

```
{
  "handlers": {
    "graphite": {
      "type": "tcp",
      "mutator": "only_check_output",
      "timeout": 30,
      "socket": {
        "host": "graphite.company.tld",
        "port": 2003
      }
    }
  }
}
```

Our InfluxDB configuration (both the Influx configuration and requisite handler):

_**/etc/sensu/conf.d/influxdb.json**_

```
{
  "influxdb": {
      "host": "192.168.1.5",
      "port": "8086",
      "database": "sensu",
      "username": "user",
      "password": "password"
  }
}
```

_**/etc/sensu/conf.d/influx-tcp.json**_

```
{
  "handlers": {
     "influx-tcp": {
       "type": "pipe",
       "command": "/opt/sensu/embedded/bin/metrics-influxdb.rb"
     }
   }
}
```

With those files added, we're able to then send the check data from the KegPi to Graphite and InfluxDB respectively.

# Wrapping Up
Whew! This post has been a bit of a long one, and I thank you for sticking through the read until this point. If you have any questions about any aspect of this, don't hesitate to leave a comment down below.

Thanks for reading!


<!-- LINKS -->

[1]: https://github.com/asachs01/kegpi
[2]: https://sensu.io
[3]: moving-to-kegging
[4]: monitoring-raspberry-pis-with-sensu
[5]: https://graphiteapp.org/
[6]: https://www.influxdata.com/
[7]: https://github.com/sensu-plugins
[8]: https://github.com/sensu-plugins/sensu-plugin
[9]: https://github.com/sensu-plugins/sensu-plugin-python
[10]: https://github.com/sensu-plugins/sensu-plugins-windows/tree/master/bin/powershell
[11]: http://blog.initialstate.com/pi-for-kids-door-sensor/
[12]: https://github.com/ClockVapor/rpi_gpio


