---
title: "Working With AI Agents: What Actually Changed How I Work"
date: 2026-09-12T18:30:00-04:00
description: "I run a small fleet of AI agents that manage my house, help run an MSP, and review each other's code. Here's what I've learned about delegation, trust, and where humans still matter."
categories: ["ai", "productivity"]
tags: ["ai", "agents", "automation", "hermes", "workflow"]
slug: "working-with-ai-agents-what-actually-changed"
ogImage: /img/og/og-working-with-ai-agents-what-actually-changed.png
draft: false
---

I have a confession that sounds like a flex until you hear the details: most of this blog post was researched, drafted, and fact-checked by an AI agent that lives on a Mac mini in my office. The words you're reading now went through its hands first. I edited, cut, and rewrote where it was wrong or boring, but the first pass wasn't mine.

That agent is named Ratatoskr, and it's one of several I run. Another one manages my family's household. A third reviews code at the MSP where I work. They text me, email neighbors, file pull requests, and once rebooted a production gateway at 2am before I even knew there was a problem.

I didn't start with a fleet. [I started with one household agent](https://sachsha.us/p/using-ai-to-lighten-the-mental-load/) and the same skepticism you probably have. This post is what I've learned since, written for people who are where I was a few years ago: curious, mildly overwhelmed, and unsure whether any of this is real or just very good at sounding real.

## Start with a job, not a tool

The mistake I see most often is people picking the tool first. They spend a weekend comparing Claude and ChatGPT and Gemini, set up the perfect folder structure, and then... don't have anything for the AI to actually do.

Work the other direction. Find something in your life that is recurring, well-defined, and mildly annoying. A weekly report nobody reads twice but has to exist. Summarizing your email backlog. Tracking the groceries. In my case it was meal planning for a family of five, which is less a task than a slow-motion negotiation that never ends.

The first version doesn't need to be impressive. My first household agent was a dumb little script that asked what was for dinner and wrote the answer to a whiteboard. What mattered was that it ran every day without me thinking about it. That's the whole test: does it survive contact with your actual week?

## What agents actually are

Strip away the marketing and an agent is a loop: the model calls a tool, looks at what happened, decides what to do next, and repeats until the task is done or it gets stuck. ChatGPT is a brilliant conversation partner. An agent is that same model with hands.

Those hands matter more than the brain. My agents don't hallucinate their way through tasks mostly because they can't: they read the real calendar, hit the real API, check the real database, and when the data contradicts them, the data wins. A chat window asks you what's true. An agent goes and finds out.

The second thing that changed my thinking: agents have memory that persists. Mine remember preferences across sessions ("Aaron hates em dashes", "buy once, not autoship"). That sounds trivial until you notice you've stopped repeating yourself. Onboarding an agent is like onboarding a new hire. The first month is annoying and full of corrections. Month three, it's just a colleague who happens to work at 3am.

## The delegation mindset

Here's the shift that took me the longest: stop reviewing everything.

I know that sounds backwards. The standard advice is to verify everything an AI tells you. For chat, sure. But you cannot scale verification of a fleet while personally checking every output, and if you try, you've just built expensive busywork for yourself. The skill that matters isn't checking work. It's designing work so that checking is cheap.

Concretely, that looks like:

- Give the agent the definition of done, not the steps. "Email the St. Elmo neighbors list asking for cardboard boxes, regular brown ones" was a real task I handed off this week. I didn't spell out the SMTP settings or the wording. It found the list address in my mail history, drafted something better than I would have, and sent it. Total involvement from me: one sentence.
- Make the work reversible. My agents commit code on branches, never main. They publish blog posts as drafts first. The dangerous version of any task is the irreversible one, so I structure tasks so the blast radius of a bad day is a deleted branch, not a production incident.
- Let them report status proactively. An agent that goes quiet for an hour is an agent you have to babysit. Mine post progress updates mid-task without being asked, which means I can glance at my phone and go back to whatever I was doing. The update is the product; the task finishes in the background.
- Verify outcomes, not outputs. I don't read the 200-line diff. I ask whether the tests pass and whether the thing I wanted to happen happened. The email either landed in the Sent folder or it didn't. The release either shipped or it didn't. Outcomes are cheap to check. Outputs are expensive to review.

## When the agents started reviewing each other

Things got genuinely weird when I let agents criticize each other's work. That's the point where one agent became [a whole pantheon](https://sachsha.us/p/from-one-to-many-ai-pantheon/), and honestly, where the interesting problems started.

At the MSP we run code review like this now: one agent writes the PR, a different model reviews it before it can merge. Not as a gimmick. Because the reviewer isn't the author, it catches things the author's model genuinely misses: a missing rollback path, a race condition, a feature that solves a problem nobody has.

There's a real tension here worth being honest about. Different models have different blind spots, and two agents can be confidently wrong together. I still read the disagreement myself when the stakes are high. But for the routine 80% of work, a second model's review is free and it catches real bugs, and it never gets tired at 6pm on a Friday.

The other surprise: agents give better code review than chat models do, because they can run the code. A reviewer that can execute your test suite beats one that can only read it.

## What I still do myself

A list of things I have not successfully delegated, in 2026:

- Deciding what matters. Agents optimize hard for whatever target you give them. Choosing the target is the job.
- Taste. When a design or a piece of writing feels off, I often can't articulate why, but I know. The agents can polish. They cannot tell me the polishing made it worse.
- Anything requiring judgment across messy human contexts. Which bid do we chase, and which one's a trap? What does my wife actually want for her birthday? The agents can gather the facts, but the call is mine.
- Trust decisions. Which vendor gets access to what. Who's allowed to touch production. I let agents propose; I decide.

That last section is shorter than it was two years ago. That's the trend to watch, not any particular tool.

## Getting started this weekend

You don't need my stack. Honestly, most of my setup is overkill for one person, and I'd rebuild it simpler today. What I'd actually do with a free Saturday:

1. Pick one recurring annoyance and write down what "done" looks like for it. Not the steps. The outcome.
2. Give it to an agentic tool with file access and a shell. [Claude Code](https://claude.com/claude-code), [Codex](https://openai.com/codex), [Cursor](https://cursor.com), or an open-source agent like [Hermes](https://github.com/NousResearch/hermes-agent). The specific one matters less than giving it real tools and a real task.
3. Run it for two weeks. Correct it when it's wrong the same way you'd correct a new hire. The corrections are not overhead; they're the training.
4. Notice when you stop checking its work on that task. That moment, when verification becomes glance-verification, is when it's yours.

The people getting real value from AI right now aren't the ones with the best prompts. They're the ones who found something real to hand over and then actually let go of it. The technology will keep getting better. The delegation muscle is the part you build.
