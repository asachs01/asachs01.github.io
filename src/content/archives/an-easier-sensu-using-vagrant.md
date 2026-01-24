---
title: "An Easier Sensu Using Vagrant"
date: 2017-11-21T21:00:14Z
description: ""
slug: "an-easier-sensu-using-vagrant"
draft: true
---

As I've been working at Sensu, one of the things that has been the most difficult for me has been creating a workflow to test customer issues and spinning up the requisite configured infrastructure. Having only a modicum of experience with most of the major config management softwares, the thought of becoming familiar enough with any of them to spin up Sensu was a bit daunting. However, repeatedly referring to Sensu's ["Five Minute Install"](https://sensuapp.org/docs/1.1/quick-start/the-five-minute-install.html) documentation was beginning to be a bit of a drag

Given that I was referring back to the docs on a frequent basis, it became clear to me that I *had* to make this a bit easier. I'd seen Cameron Johnston at Sensu using Vagrant in his demos, and settled on using that as my primary way to spin up boxes replicating customer environments, as well as my primary way to show off Sensu when doing training. Full disclosure, I owe a large part of this to Cameron and his [Github Gist](https://gist.github.com/cwjohnston/7f7691f006ce89189d73d9c359cd7967), as it was formative for how I've approached 