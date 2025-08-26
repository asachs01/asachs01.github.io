+++
author = "Aaron Sachs"
categories = ["career", "how I work"]
date = 2017-08-22T00:57:25Z
description = ""
draft = false
slug = "moving-back-to-linux"
tags = ["career", "how I work"]
title = "Moving (Back) To Linux"

+++

I'm a bit of a productivity nerd, I'll admit. Over the last couple of years, I've cultivated a workflow that revolved around a lot of OS X tools that I LOVED:

* Alfred
* TextExpander
* iTerm2

These tools were my bread and butter. My professional life, if you will. However, I found myself in a bit of an odd spot in recent months--my MacBook Air was proving to be underpowered for running VM's, and doing any sort of virtualized anything (which I wanted to be able to do for some training and other projects). While I wanted a shiny new MacBook Pro, I found it to be overpriced, and something that I couldn't justify spending the kind of money on, despite that all of my tools were built exclusively for the MBP platform.

So I decided to move back to Linux. At Rackspace, I'd had an Optiplex workstation that ran Fedora, and it worked OK, if not for the fact that every update screwed up my display drivers. I honestly wasn't very keen to be back on Linux. The last thing I wanted to do was be in a situation where I'd have to cobble some sort of solution together, and it would require more time and effort that I have at the moment.

Serendipitously, one of my former coworkers and her husband turned me onto Korora. To be fair, there's not a whole lot more that Korora has over Fedora. Thus far, it's proven to have some prettier defaults. Not much more than what Fedora would have, but it beats taking the time out of my day to hunt around and change things.

To my delight, the experience has been surprisingly Mac-like (even to the point of competing with ElementaryOS). To my further delight, it has dark themes out of the box (swoon), which makes working at night much less stressful on the eyes.

The biggest challenge in moving back to a Linux distro as a daily driver has been finding a replacement for Alfred & TextExpander. The terminal challenge was easily solved with either terminator or tmux (now being a bit wiser, I'm using tmux with GREAT success). However, finding something that had similar functionality to TextExpander and Alfred was a bit difficult at the onset.

I'd tried Albert, an Alfred-like replacement for Linux, but to no avail. While Albert's got a decent start, it lacks quite a bit of Alfred's functionality. For example, Alfred has built-in clipboard management (now using Clipit), built-in snippets (which Autokey seems to do a decent job of), and workflows, which I haven't quite figured out a replacement for and probably won't at this point since I wasn't using them all that much anyways.

At the time of writing this post, I'm back up to speed in terms of where I was with my Mac. I've managed to recreate my level of productivity and automation with the following:

* Alfred --> Korora menu button/Clipit
* TextExpander --> Autokey
* iTerm2 --> Terminator/tmux

Next on my productivity list is tackling my dotfiles. More to follow!

Cheers,

Aaron