---
author: Aaron Sachs
slug: sensu-gremlin-part-2
title: "Badass Monitoring, Pt 2: The 'Why'"
date: 2019-06-06T10:31:40
description: "A short discussion on why we're using Sensu and Gremlin"
categories: ["monitoring", "sensu"]
tags: ["sensu"", "monitoring", "chaos engineering"]
draft: true
---

# Back it up

Oh man, did I get ahead of myself in my [last post][1]. I started chatting tools, and I realize now that I really should have been talking more about why I'm using Sensu and Gremlin. But it didn't occur to me until this past week at [Monitorama][2].

[John Allspaw][3] gave the keynote talk (Taking Human Performance Seriously) this year. While you can watch the talk [here][4], I'll highlight a few points here:

* People will pursue what they think will be productive, and won't pursue that which they feel isn't productive
* Monitoring & observability are inextricably linked with other activities
* Ask and develop better questions when doing incident analysis
* Disagreements are data
* Incidents are investments that your organization accidentally made

There are a ton of other great points that John makes. Please, take a few minutes and give it a listen.

# What does it mean, Basil?

Ok, so what does all of that mean and what does it have to do with chaos engineering experiments and monitoring? Everything! When you consider what happens with an incident, the last thing anyone wants is more monitoring noise, or to be surprised by the information they receive. It's not useful. 

The tools we use when making sense of an incident should provide us with information in such a way that our reasoning about and making inferences during an incident are better because of that information. Informational cruft (i.e., contextless, repeated, action-less alerts) ultimately do damage, or at the very least, don't contribute to making sense of an incident.

This is why I'm using Sensu and Gremlin--to refine the tool that I use for monitoring so that the information I have is of high quality and is a useful part of my information gathering and sense-making processes.

# Oh the places we'll go

The rest of this series is going to focus on this: making Sensu a high-quality information gathering and sense-making tool for incidents. Not that it isn't already a great tool, but just slapping a status check on a group of boxen doesn't 👏 make 👏 for 👏 useful 👏 monitoring! There's more to metric gathering and status checks. So we're going to work through that. We'll go from the most minimal thing we can do (a status check) to an alert that provide us with high-quality information for future troubleshooting. We'll use Gremlin along the way as the means of refining those alerts.

Cheers,

Aaron

*<!--LINKS-->*
[1]: ../sensu-gremlin-intro/
[2]: https://monitorama.com/2019/pdx.html  
[3]: https://twitter.com/allspaw
[4]: https://youtu.be/eZJoevaojyE?t=2497