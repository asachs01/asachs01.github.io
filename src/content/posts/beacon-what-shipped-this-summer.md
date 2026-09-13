---
title: "Beacon: What Shipped This Summer"
date: 2026-09-12T21:30:00-04:00
description: "Eleven releases in eleven days, a release pipeline that was quietly broken for months, and what came out the other side: a full Chores screen, tasks that know who checked the box, and calendar editing that survived Home Assistant moving its API."
categories: ["personal", "projects", "home-assistant"]
tags: ["beacon", "home-assistant", "open-source", "ci-cd", "raspberry-pi"]
slug: "beacon-what-shipped-this-summer"
ogImage: /img/og/og-beacon-what-shipped-this-summer.png
draft: false
---

I shipped eleven releases of Beacon in eleven days this August. That sentence sounds like momentum until I tell you what most of them were fixing.

If you're new here: Beacon is a family command center that runs as a [Home Assistant](https://www.home-assistant.io) add-on. It turns a cheap monitor into a wall calendar with meal planning, chores, and weather, all pulling live from your existing HA entities. I wrote about [why I built it](https://sachsha.us/p/beacon-skylight-alternative-home-assistant/) back in the spring, when it was a Skylight alternative. It still is. It's also become the screen my family actually touches every day, which changes how carefully I treat it.

## The pipeline that was never running

The summer started with an embarrassing discovery. Beacon had a release pipeline: merge to main, semantic-release cuts a version, a second workflow builds and publishes the Docker image. Green checks all the way down.

Except the image had never built. Not once, in roughly twenty releases.

The root cause is a GitHub behavior that feels like a prank: when a workflow authors a release using the default `GITHUB_TOKEN`, GitHub deliberately does not fire downstream workflows that listen for releases. It's loop prevention on their side. The effect on mine was two workflows succeeding forever in parallel universes that never touched.

Fixing it wasn't one fix. Each layer I repaired revealed the next: the trigger gap itself, then a `workflow_call` detection bug, then build paths that only existed in one of the repo's two directory trees, then a container registry permission 403, then a checkout pinned to a stale commit that tagged images one version behind. Five separate bugs, each invisible until the layer above it actually ran for the first time in months.

The lesson I kept is simple. A green check means a step ran. It does not mean the artifact you promised exists. Now I verify the artifact.

## When Home Assistant moved the chess piece

While I was inside the machinery, Home Assistant itself changed underneath me: calendar event update and delete moved off the REST services API to WebSocket-only commands. On my install, every Google-backed calendar quietly lost update support at the same time. Beacon's edit button broke for reasons that had nothing to do with Beacon's code.

The fix was a two-path bridge. In standalone mode the app talks WebSocket directly. In add-on mode there's no browser-side token to open one, so the server opens a short-lived connection on the device's behalf. And since most real calendar providers don't support updates at all, Beacon now falls back to delete-and-recreate when a provider refuses, which is invisible to the person tapping the screen.

This is the maintaining-an-integration tax nobody warns you about. HA did nothing wrong. The API moved, the change was documented, and every consumer either tracked it or quietly rotted.

## What you actually get

With the plumbing holding, the features landed:

- A dedicated full-screen Chores view with a column per family member, so everyone's week is readable from across the room instead of one long list
- Tasks that understand who checked the box. A shared task assigned to two kids used to double-render and complete for both at once; now completion belongs to the person who actually did it
- Hidden calendars stay hidden everywhere, not just on the screen where the setting originally worked
- An `HA_API_BASE` override, so the container also runs outside a Home Assistant supervisor for people deploying it their own way

## Where it stands

Free, MIT licensed, no subscription, [the repo is open](https://github.com/asachs01/beacon) and [the docs live here](https://beacon-family-docs.netlify.app). If you already run Home Assistant, it's a one-click install from the add-on store.

The roadmap is whatever my family complains about next, which is the best product process I've found.
