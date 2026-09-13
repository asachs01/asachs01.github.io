---
title: "Beacon: A Free Skylight Alternative for Home Assistant Users"
date: 2026-04-03T21:06:00-04:00
description: "Skylight Calendar 2 costs $300 plus $79/year for the good features, and it doesn't talk to Home Assistant. Beacon is free, open source, and runs as an HA add-on on a Pi and a $100 monitor."
categories: ["personal", "projects", "home-assistant"]
tags: ["beacon", "home-assistant", "open-source", "raspberry-pi", "skylight", "mcp", "family"]
slug: "beacon-skylight-alternative-home-assistant"
ogImage: /img/og/og-beacon-skylight-alternative-home-assistant.png
draft: false
updated: 2026-09-12T21:00:00-04:00
---

If you've looked at Skylight and done the math, you already know: it's $299.99 for the hardware, then $79/year for Calendar Plus, which is where the good stuff lives. Meal planning, photo screensaver, magic import. The baseline experience without a subscription is fine. The experience you actually want costs extra, forever.

And it still doesn't talk to Home Assistant.

That's why I built [Beacon](https://github.com/asachs01/beacon).

## What it is

Beacon is a family command center that runs as a Home Assistant add-on. It turns any wall-mounted display into a dashboard with a weekly calendar, meal planning, chore tracking, music controls, and weather, all pulling live from your existing HA entities.

No subscription. No cloud account. No data leaving your network. MIT licensed and free forever.

## What I'm running it on

A Raspberry Pi 5 and a ~$100 touch monitor. That's the whole hardware cost. If you have a spare Pi or an old tablet, you probably already have what you need. Installation is one click if you're already on Home Assistant:

[![Add to Home Assistant](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fasachs01%2Fbeacon)

## What we actually use every day

Two things get the most use: the calendar and meal planning.

The calendar pulls directly from HA calendar entities: every family member's schedule is already there, color-coded, no manual entry required. The meal plan bar shows the week's dinners at a glance. Combined with [HomeClaw](https://github.com/asachs01/homeclaw) managing inventory and planning, the "what's for dinner" conversation has basically been eliminated. I wrote about [the household agent behind that planning](https://sachsha.us/p/using-ai-to-lighten-the-mental-load/) if you want the backstory.

## Built for LLM integration

Beacon ships with a native MCP server. If you're running Claude, or any other tool-capable LLM, you can connect it directly to your Beacon instance. Ask it what's on the calendar, what's for dinner, who has chores due. The LLM has full context of what's on your family dashboard.

It also supports Home Assistant Assist custom sentences and a voice API, so hands-free control works out of the box.

## The comparison

| | Skylight Calendar 2 | Beacon |
|---|---|---|
| Hardware cost | $299.99 | Pi + ~$100 monitor |
| Subscription | $79/year (Plus) | Free forever |
| Meal planning | Plus tier only | Included |
| HA integration | ❌ | ✅ |
| MCP server | ❌ | ✅ |
| Self-hosted | ❌ | ✅ |
| Open source | ❌ | ✅ |

## Get started

- Docs: [beacon-family-docs.netlify.app](https://beacon-family-docs.netlify.app)
- Repo: [github.com/asachs01/beacon](https://github.com/asachs01/beacon)

It's actively developed. Feature requests welcome: open an issue or drop into the discussions tab.
