---
author: Aaron Sachs
slug: sensu-go-on-osx
title: "Compiling and Running Sensu Go on OS X"
date: 2019-05-16T19:49:32-05:00
description: "How to compile and run Sensu Go on Mac OS X"
categories: ["monitoring", "sensu", "osx"]
tags: ["sensu", "monitoring", "mac", "osx"]
---

I've been messing around with compiling Sensu Go for several different platforms lately. In my [last post][1], I got Sensu Go agents running on my Raspberry Pis and Nvidia Jetson Nanos. I wanted to see if I could get an agent running on OS X as well, because who doesn't want to monitor their laptop!

# The Setup

Similar to what I did previously (and subsequently learned a ton more about), we'll need to compile the Sensu Go packages since they're not currently packaged for OS X. Let's take a look at what we'll need to get started:

1. Install Go on your system
2. Grab Sensu Go
3. Build your binaries

## Installing Go

If you've not already installed Go on your system, please see [Go's installation documentation][2]. You can either download Go there, or install it with `brew install golang`

## Obtaining Sensu Go

If you haven't read the last post, it's trivial to download Sensu Go into your Go workspace. Just run the following:

```
go get github.com/sensu/sensu-go/...
```

And head to `$GOPATH/src/github.com/sensu/sensu-go`. 

## Building the Binaries

So instead of using `build.sh` to create our binaries, we're going to do something a bit different, and use what I feel to be an easier way of building our binaries. 

From inside `$GOPATH/src/github.com/sensu/sensu-go`, we're going to run this command:

`GOOS=darwin GOARCH=amd64 go install ./...`

Once that's finished, you should see the binaries in `$GOPATH/bin/`:

```
$ ls
check_protoc  gengraphql  linux_arm64  make_typemap   sensu-agent    sensuctl
example       linux_arm   loadit       proto2graphql  sensu-backend  version
```

You'll notice I have a couple of other builds there, but we're concerned _only_ with the `sensu-agent` binary.

Cool! Now that it's built, let's move on to actually running Sensu Go on OS X.

# Running Sensu Go

Since Sensu Go isn't currently packaged for OS X, there's a bit of finagling we have to do to get it to run as a service. 

Of course, you can always just start up the Sensu agent, but exiting will prevent it from running. So, we need a better approach. We're going to follow a similar path from my last post, and do the following:

1. Create the plist file for the respective services
2. Create the Sensu user/group
3. Create the respective directories needed for Sensu to operate
4. Grab config files for Sensu Go

## Creating the Plist File

If you've never dived into running OS X services, plist files are property files written in XML that define how you want to run an application or service. We'll need this in order to have the Sensu agent run whenever we log in.

The file looks like this:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>io.sensu.sensu-agent.plist</string>
    <key>UserName</key><string>_sensu</string>
    <key>GroupName</key><string>_sensu</string>
    <key>ProgramArguments</key>
    <array>
      <string>/usr/local/bin/sensu-agent</string>
      <string>start</string>
    </array>
    <key>RunAtLoad</key><true/>
    <key>KeepAlive</key><true/>
    <key>StandardOutPath</key>
    <string>/var/log/sensu/sensu-agent.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/sensu/sensu-agent.log</string>
  </dict>
</plist>
```

In the interest of making things slightly easier than a copy/paste, you can run this:

```
sudo curl -s -L x  https://gist.githubusercontent.com/asachs01/ecf83fe92624e7f346d2c5362d825e1c/raw/ec9bec6b97fd89b671ce0ceba2a3780eca04fef6/io.sensu.sensu-agent.plist -o /Library/LaunchDaemons/io.sensu.sensu-agent.plist
```

It's worth noting that we're placing this in `/Library/LaunchDaemons` versus `/Library/LaunchAgents`. This is because we want to run the service at boot, not just login (you can read more [here][3])

Alright, now it's time to create the Sensu user and group.

## Create the Sensu User/Group

This isn't nearly as straighforward as I'd hoped. If you recall, for Linux systems, this is as easy as a `useradd`. In OS X, however, we use the command `dscl`, which takes a few different arguments.

In Sensu Core, the OS X package had a script to run this as part of its postinstall process. After doing some digging and dissecting of that package, it turns out that there's a handy little function in the script that will do the trick. It looks like this:

```
#!/bin/sh

create_sensu_user_group()
{
    # create sensu group
    set +e
        dscl . -list /Groups | grep "^_sensu" > /dev/null
        RC=$?
    set -e
    if [ "${RC}" != "0" ]; then
                last_used_gid=`dscacheutil -q group | grep gid | tail -n 1 | awk '{ print $2 }'`
        sensu_gid=`echo "$last_used_gid + 1" | bc`
        dscl . -create Groups/_sensu
        dscl . -create Groups/_sensu PrimaryGroupID $sensu_gid
    fi

    # create sensu user
    set +e
        dscl . -list /Users | grep "^_sensu" > /dev/null
        RC=$?
    set -e
    if [ "${RC}" != "0" ]; then
                sensu_gid=`dscl . -read /Groups/_sensu | awk '($1 == "PrimaryGroupID:") { print $2 }'`
        dscl . -create /Users/_sensu UniqueID $sensu_gid
        dscl . -create /Users/_sensu PrimaryGroupID $sensu_gid
        dscl . -create /Users/_sensu UserShell /usr/bin/false
    fi
}

create_sensu_user_group
```

You can pull this down by running:

```
curl -LO https://gist.githubusercontent.com/asachs01/ecf83fe92624e7f346d2c5362d825e1c/raw/ec9bec6b97fd89b671ce0ceba2a3780eca04fef6/create_sensu_user_group.sh
```

And then:

```
chmod +x create_sensu_user_group.sh
```

And run it:

```
./create_sensu_user_group.sh
```

Which will give us our user and group. Now, on to the directories.

## Create Sensu Directories

In this part of the exercise, we're going to diverge slightly from how we did things on the Pis and Nanos. We're going to just run:

```
sudo mkdir -p /etc/sensu/cache/sensu-agent
```

The reason for this is due to my own inability to figure out why I couldn't have Sensu create and manage the `/var/cache/sensu` directory like I'd expected. After several hours of pounding away at what I thought would be simple permissions issue, I decided that I'd just run the command above and change my cache directory in the config.

So from here, we need to run:

```
sudo chown -R _sensu:_sensu /etc/sensu 
```

This should get us where we need to go in terms of files and permissions.

## Obtaining Sensu Go Config Files

Like the last post, this stays the same. 

```
curl -LO http://docs.sensu.io/sensu-go/latest/files/agent.yml

sudo cp agent.yml /etc/sensu
```

## Starting Sensu Go

Alright, now we're pretty much set and just need to start up the Sensu agent:

```
sudo launchctl load -w /Library/LaunchDaemons/io.sensu.sensu-agent.plist
```

Now, let's check to make sure the agent is running:

```
sudo ps -ef | grep -v grep |grep "sensu-agent"  
  400 12927     1   0 11:51AM ??         0:04.14 /usr/local/bin/sensu-agent start
```

And we can do a couple of other things to verify that the agent is doing what we expect:

```
tail -f /var/log/sensu/sensu-agent.log
```

Which should give us logs that show we're doing things and then also check to see that the agent shows up in the dashboard:

<a href="http://share.sachshaus.net/f0a256c17af0" target="_blank"><img src="https://d1c0hjomoutdrw.cloudfront.net/items/2Z3s2V162A3a3D3D2d2N/Image%202019-05-17%20at%203.09.24%20PM.png" style="display: block;height: 600px;width: 900px;"/></a>

Boom! There you have it!

Cheers,

Aaron






   
   
   
<!--LINKS-->
[1]: ../sensu-go-on-arm/
[2]: https://golang.org/dl/
[3]: http://www.grivet-tools.com/blog/2014/launchdaemons-vs-launchagents/