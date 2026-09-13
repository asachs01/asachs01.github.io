---
title: "Building a Wake-Up Alarm My Family Won't Hate"
date: 2026-08-12T09:15:00-04:00
description: "Every smart wake-up solution I found was loud, harsh, and one wrong Siri command away from a fight with my wife. So I built our own, three rooms, one gentle chime, and an off switch nobody has to think about."
categories: ["personal", "projects", "home-assistant"]
tags: ["home-assistant", "homekit", "smart-home", "family", "automation"]
slug: "gentle-wake-up-alarm-home-assistant"
ogImage: /img/og/og-gentle-wake-up-alarm-home-assistant.png
draft: false
updated: 2026-09-12T21:00:00-04:00
---

My household has a 6:30am problem. Getting everyone up on time is a daily fight, and every "smart" wake-up solution I looked at solves it by being loud, harsh, and one wrong Siri command away from a fight with my wife.

So I built our own. Three rooms, one gentle chime, and an off switch simple enough that nobody in my house has to come find me about it.

## The sound problem

First instinct: generate something musical. My first pass was ascending bell tones, pentatonic, nothing dissonant, fading in over 30 seconds. Technically gentle. My wife's actual response: "Oh god no. Those tones would piss me off."

Fair. Bells and chimes still read as *alarm*, no matter how soft you make them. She wanted rain and birds and something plucked, not a device announcing itself.

Round two: rain, a soft kalimba melody wandering through a pentatonic scale, a few sparse bird chirps. Closer. She mentioned she uses Apple's "Early Riser" tone on her phone, which I couldn't extract (it's Apple's, not mine to rip), but it told me exactly the register to aim for: warm, plucked, unhurried.

The version that shipped swapped the rain for forest ambience: wind swells, rustling leaves, denser bird calls. Same kalimba melody underneath, same 45-second fade so nobody gets ambushed awake at 6:30.

## Three rooms, one loop

The mechanism itself is simple. Three Home Assistant automations fire at 6:30am, each starting a script that loops the chime on one speaker (a HomePod mini, a room speaker, a satellite speaker in our bedroom) every 92 seconds until someone kills it.

What "kills it" needs to mean is where I actually had to think. My own words to myself going in: this has to be dead simple to turn off, because my wife and my girls will not tolerate an alarm they can't kill easily. She especially will be furious with me if it's a hassle.

That wasn't a nice-to-have, it was the whole point of the project. So there are three ways to dismiss any single alarm. Say "Hey Siri, turn off Lennon's Alarm" (or Elie's, or the main bedroom's, each one is its own HomeKit switch). Tap the speaker to stop it, the way you'd stop any device making noise at you. Or hit a toggle on [our family dashboard](https://sachsha.us/p/beacon-skylight-alternative-home-assistant/), which sits right on the home screen where nobody has to hunt for it.

## The bug that would have made it worse

Tapping a speaker to stop it and a 92-second loop cycle finishing on its own look identical to Home Assistant. Both just report the player going idle. If I'd wired "goes idle" straight to "turn the alarm off," two things would have broken: a tap wouldn't actually kill anything, since it would just restart on the next loop, or a normal loop cycle would falsely dismiss an alarm nobody touched.

The fix checks how much of the track was left when it stopped. Ten seconds in with most of the track remaining means someone tapped it. Nothing remaining means it just finished a cycle on schedule. I tested both directions: armed an alarm, let it play, tapped stop early, confirmed it stayed off. Armed it again, let a full cycle finish naturally, confirmed it kept looping instead of quietly shutting itself down. Both did what they were supposed to.

## Where it stands

Every weekday at 6:30am, three speakers in three rooms start playing the same forest soundscape, quiet at first, building over 45 seconds. Anyone can kill their own alarm with a word, a tap, or a glance at a screen. My wife hasn't yelled at me yet, which around here counts as a shipped feature.
