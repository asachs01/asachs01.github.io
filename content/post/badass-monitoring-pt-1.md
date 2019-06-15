---
author: Aaron Sachs
slug: sensu-gremlin-intro
title: "Badass Monitoring, Pt 1: Sensu & Gremlin"
date: 2019-05-30T09:03:24-05:00
description: "Using chaos engineering principles to enhance your monitoring tools"
categories: ["monitoring", "sensu"]
tags: ["sensu", "gremlin", "monitoring", "chaos engineering"]
---

One of my earliest jobs was as an admin for an MSP. We'd routinely generate alerts that weren't actionable, lacked context, and for most of our customers, were considered noise. From a monitoring perspective, it was bad. Customers didn't trust in the alerts they received and often resorted to having some additional monitoring product installed on their systems. It's safe to say that our auto-generated tickets and emails were largely ignored.

In an effort to avoid repeating mistakes of the past, I want to ensure that I have actionable alerts that are context heavy. Thankfully, there are a couple of tools that I've found go a long way in helping me with that effort: Sensu and Gremlin. I'll do an intro to those tools today, and we'll pick up on how these tools work together in the next post. It's worth mentioning that I am a Sensu employee.

With that out of the way, let's get to the tools!

# **The Tools**

## **Sensu**

If you've not used [Sensu](https://sensu.io) before, allow me to make a formal introduction. At Sensu, we talk about it as a "monitoring event pipeline." The concept is similar to a CI/CD pipeline, except that instead of releasing software software, I'm sending monitoring event data. The goal with the pipeline being that by the time I receive a monitoring event or alert, I know beyond a shadow of a doubt that what I have in front of me has been verified and provides me with exactly what I need to act on the data.

For this series, I'll be using Sensu as my monitoring tool of choice.

## **Gremlin**

If you're in IT, you're probably familiar with Gremlins.

![gremlin gif][1]

Yes, those ones. They've been known to cause many an issue, but in this case, I'm talking about this [Gremlin][2] in particular. Gremlin is a [chaos engineering][3] tool that allows you to run targeted attacks on your infrastructure. This can be anything from a time-drift attack to more complicated types of attacks. The goal here will be to apply the principles of chaos engineering to uncover any weaknesses in our Sensu deployment and ensure that it is able to withstand real-world conditions.

We'll also use Gremlin to introduce conditions that will generate Sensu alerts. By introducing those conditions, we'll be able to ensure that the alerts generated follow the [CASE][4] method. 

# **The Setup**

## **Sensu**

I've already set up Sensu in my own environment (which is Ubuntu 18.04), so I'm not going to walk through that here. However, if you don't have a working Sensu deployment, you'll want to checkout the [Sensu installation doc][5], so that you can get all of the various Sensu components installed. It's worth noting that for some our later testing, we'll be using a clustered deployment. For that, you'll want to take a look at the [clustering doc][6].

## **Gremlin**

Just like Sensu, we'll need to install Gremlin's agent so we can start ~~doing pseudo-nefarious stuff~~ performing attacks on our test boxen. 😈 In this case, since I'm using Ubuntu 18.04 as my test box of choice, I'll also follow [Gremlin's installation guide][7] for Ubuntu as well (though it's for Ubuntu 16.04, this should still work in our case). 

# Next Steps

Once you've got both Sensu and Gremlin installed, let's run a couple of tests to make sure things are working like we expect them to. 

## Sensu

One of the cool things about Sensu is that you can monitor anything and you can have alerts generated from any number of things, not just the [community plugins][8] or [assets][8] Sensu offers. We can create some ad-hoc alerts using the [agent API][9] just to see what an alert might look like in our dashboard. To do that, run the following on your test VM:

    curl -X POST \
    -H 'Content-Type: application/json' \
    -d '{
      "check": {
        "metadata": {
          "name": "mysql-backup-job"
        },
        "status": 0,
        "output": "mysql backup initiated",
        "ttl": 25200
      }
    }' \
    http://127.0.0.1:3031/events

That command creates a mock event and sends it to the agent API. Now, this might be useful if I had some sort of code that monitored a mysql backup job and emitted this message. In our case, it's just for us to make sure that we've set up and configured Sensu correctly. A successful test should leave you with an event that looks something like this:

BOOM! 💥 Our test worked! Let's just run a quick sample attack with Gremlin now.

## Gremlin

Just like we tested Sensu to make sure we're able to receive events, we're going to test our Gremlin agent. You can see me run the attack below:

<video src="https://dad6pq311uj47.cloudfront.net/items/3r042g3v3d3A3N04383U/Screen%20Recording%202019-06-14%20at%2003.25%20PM.mov" controls style="display: block;height: auto;width: 100%;">Screen Recording 2019-06-14 at 03.25 PM.mov</video>

There we have it! Both Sensu and Gremlin are working like we expect them to. In the next post, I'm going to dig a bit more into the "why" of using a chaos engineering tool like Gremlin to test monitoring tools like Sensu.

*<!--LINKS-->*
[1]: https://media.giphy.com/media/BqPljBK6V9ZPG/giphy.gif
[2]: https://www.gremlin.com/
[3]: https://principlesofchaos.org/
[4]: http://onemogin.com/monitoring/case-method-better-monitoring-for-humans.html
[5]: https://docs.sensu.io/sensu-go/5.9/installation/install-sensu/#install-the-sensu-backend
[6]: https://docs.sensu.io/sensu-go/5.9/guides/clustering/
[7]: https://www.gremlin.com/community/tutorials/how-to-install-and-use-gremlin-on-ubuntu-16-04/