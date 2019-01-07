+++
author = "Aaron Sachs"
categories = ["career", "support-driven"]
date = 2016-11-26T01:46:00Z
description = ""
draft = false
slug = "it-came-from-the-night-shift"
tags = ["career", "support-driven"]
title = "It Came From the Night Shift"

+++

Whew, I'm catching up on posting for the [Support Driven Writing Challenge](https://supportdriven.com/2016/10/21/stretch-your-typing-fingers-support-driven-6-week-writing-challenge/), and I'm fairly caught up at this point. So this week's post is a 'Day In the Life' of whatever it is you do. Since I'm in my first ever third shift position, this should be interesting!

### The Schedule

Before coming to DigitalOcean, I was in a 'normal' 9-5 position. Then, I flipped completely over to 3rd shift when I joined DO. Now I'm working 11pm CDT to 7am CDT. I'll walk you through what my typical day looks like:

* 14:30-15:00: Wake Up, get ready
* 15:00-17:00: Head to Starbucks to write, learn, catch up on stuff while people are in the office, maybe run some errands
* 17:00-17:30: Head home
* 17:30-20:00: Start cooking dinner, run other errands
* 20:00-22:00: Take a nap and get ready for my shift
* 23:00-07:00: Do all the work

That's a quick breakdown of the schedule. But what, you ask, does a Customer Success Engineer actually do?

### What it is I say I do at DO

Let me start by explaining my team's mission: [To] forge and foster close relationships with key customers by ensuring their success on our platform. What does that mean practically? Well, there are really three 'hats' that our duties fall into:

* Account Management
* Tier 2 Support
* Solutions engineering/consulting

So on any given night, I can have a mix of tasks that is a random collection of those duties. Right now, there is a pretty heavy leaning to support and account management requests since I work primarily with our APAC customers. Let me give you an idea of how these sorts of things fall into a normal night.

I'll usually come in and give a nod to my colleagues Huck and Jon (depending on the night) on Slack as they're headed out for the evening. I'll also ping our Support team and Cloud Operations team to let them know that I'm in, and to ping me if they need anything. From there, I'll catch up on what's gone on during the day. This usually consists of reviewing what's happened in our Slack channels (we have a general channel, as well as a 'standup' channel for any notable issues that occurred, or that need follow up) and perusing my email. A quick note here: I get TONS of email. I've got everything filtered so that anything that doesn't come in through HelpScout, and isn't a general notification gets pushed to the top of my inbox.

After I've caught up on the day and email, I'll check and see if there's been any movement on any Jira tickets I've opened previously, or if anything is needed from me on them. Nine times out of ten, one of my DayWalker colleagues have addressed the Jira if it's a customer-facing/impacting issue.

From there, the rest of my time is spent responding to support requests and [Hatch](https://do.co/hatch)(our initiative to support startups as they launch) applications. The requests that we get are pretty varied. Most of the time, the requests that come in are that a droplet (our term for a VPS) has become unresponsive, or that the customer can't log into the droplet and need us to boot it into a recovery mode. However, we do get some interesting issues during the night. For example, a customer's MongoDB cluster had an issue that resulted in their metadata getting corrupted, and we had to troubleshoot that. Keep in mind that DigitalOcean is a self-managed platform, which means we don't log into customer droplets. This can make troubleshooting a challenge. It's forced me to get better at thinking through an issue, how I would address it/troubleshoot it, and explaining that process to a customer. We also see issues end up being symptomatic of something larger, and may require the customer to re-architect their infrastructure.

In addition to the customer-initiated support requests, there are also the inevitable issues that arise when dealing with technical gremlins. These tend to manifest themselves in us having to reboot hypervisors (underlying infrastructure that runs customer droplets), and can be for any number of reasons.

Our solution engineering/consulting process is in the process of changing. When I started, each of the Customer Success Engineers at DO were responsible for consulting/engineering requests and calls that came in to our team. Now, our Customer Success team does more of a qualification process to see if a customer would need to have a chat with our Solutions team, who are the ones who take on more of the engineering/architecting sort of work. When I have those sorts of calls scheduled at night, they now tend to fall into the pre-qualification sort of vein where I chat with the customer to see what problem they are currently experiencing, how they have their infrastructure set up, and what their end goal of the re-architecture process is.

When I don't have any requests, or issues to address, it can be a bit lonely/quiet, especially working from home. So I'll fill my time learning what I can via Linux Academy, Udemy, and my ever-growing stack of Oreilly ebooks. When that fails, I'll get up and try and give myself a change of scenery. At 3-4am, this is a bit difficult. I'm not too keen on wandering around in my Cthulu slippers and having our local law enforcement called due to the 'creeper in octopus shoes walking around the neighborhood' (note: this has NOT happened yet, and I aim to keep it that way). So sometimes, I'll go outside and smoke my pipe, or at the kitchen table, or in front of the TV with some anime playing in the background. In the case of last night, a fire at 2am sounded grand, so I made one and worked outside last night.

![workFire](/content/images/2017/08/workFire.jpg)

I wrap up my shift by doing a brief handoff with our first shift CSE's, greet the wife as she wakes up and heads out to work, and then promptly conk out for the 'night'. I'll be writing a follow up post to this about surviving 3rd shift, since I feel like I could write a small book on it. Stay tuned for more!

Cheers,

Aaron

