---
title: "What My Side Projects Are Really About"
date: 2026-06-18
categories: ["Building in Public"]
tags: ["opensource", "cognition", "tools", "experiments"]
description: "ChillStep Radio, quantum chaos, synesthetic pianos, and a robots.txt for AI — the side projects I build when enterprise platforms go quiet and curiosity takes the wheel."
readingTime: 16
filter: design
toc: true
draft: false
---

There is a particular kind of silence that arrives after a long day of architecture reviews and compliance checkpoints. The laptop is still warm. The room is dark. And somewhere in the back of my mind, a question starts tapping like a finger on glass: *what would it feel like if this were simpler, sharper, more human?*

That is usually when a side project begins.

I do not build these tools to pad a portfolio. In my view, they are something closer to field notes — small, honest experiments in how software can support the way people actually think, focus, perceive, and play. Some are practical. Some are strange. All of them teach me something I bring back to the serious work.

## The Focus Engine: ChillStep Radio

It started innocently enough. I wanted music for deep work — not a streaming service with opinions about what I should listen to next, but **my** library, **my** atmosphere, **my** rhythm. Rain layered over chillstep. A looping city-night video behind the player. A Pomodoro timer that respects the fact that focus is not infinite.

[ChillStep Radio](https://github.com/JamalYusuf/ChillStep-Radio-Desktop) is a native desktop app built with Go and Wails — the same discipline I use at work, applied to something personal. No cloud. No accounts. Your music stays on your machine, which, if you think about it, is a small act of sovereignty in an age of rented everything.

You can [listen live](https://jamalyusuf.com/radio/play/) or grab the desktop build from GitHub. I built it for late-night coding sessions and rainy afternoons. It works for me. Maybe it works for you too.

What did it teach me? That **environment shapes cognition** more than we admit. The right ambient layer does not make you smarter — but it can make you less fragmented. And fragmentation, in my experience, is the real enemy of expertise.

## Seeing the Page: Eyes and Annotate Pro

Two Chrome extensions. Two sides of the same coin: **how do we actually experience the web?**

[Eyes](https://github.com/JamalYusuf/Eyes) came from a simpler frustration. I was reading long articles at midnight and my eyes were losing the argument. Every site has its own idea of dark mode — some native, some fake, most inconsistent. Eyes tries to be decisive: smart dark detection where sites already support it, thoughtful filter fallbacks where they do not, plus readability controls that feel like tuning an instrument rather than flipping a switch.

[Annotate Pro](https://github.com/JamalYusuf/Annotate-Pro) came from teaching and presenting. I wanted to mark up a live webpage — circle a diagram, draw an arrow, use a laser pointer during a screen share — without opening a separate tool or fighting rounded, bubbly UI that feels like it was designed for a different species of user.

Both extensions share a design philosophy I am probably too vocal about: **sharp corners, red accents, zero fluff**. Red means business. Decisive tools for decisive moments.

From an Expert Vision perspective, these projects are tiny windows into perception. When I watch someone annotate a page, they do not read linearly — they **anchor** on structure first, then detail. When someone adjusts contrast and line height, they are not "customizing a website." They are negotiating with their own visual system.

What if our tools respected that negotiation by default?

## Play as Research: White Dot Chaos and Chromatic Symphony

Not every experiment needs a business case. Some need a white dot.

[White Dot Chaos](https://github.com/JamalYusuf/White-Dot-Chaos) is a canvas game that sounds silly until you sit with it. You guide a dot through a universe of shapes — circles, squares, triangles — collecting modifiers, surviving escalating madness. It is part arcade, part meditation, part physics toy.

The interesting bit, at least to me, is the entropy layer. You can run the game on ordinary pseudo-randomness, or flip a switch and feed it **quantum random numbers** from ANU's QRNG API. Real unpredictability from quantum vacuum fluctuations, piped into a browser game about a white dot.

Why? Because I am curious whether true randomness changes how players decide — whether it expands the perceived possibility space in the brain the way it expands the possibility space on screen. I do not have a peer-reviewed answer yet. I have a hypothesis and a checkbox labeled *Use Quantum Entropy*. Sometimes that is enough to keep a project alive.

[Chromatic Symphony](https://github.com/JamalYusuf/Chromatic-Symphony) explores a different boundary: **synesthesia as interface**. Drag across a color gradient and hear frequency. Play a piano where each key has a hue. Compose a melody and watch it bloom into light spectra. It is a love letter to the idea that senses are not as separate as school taught us.

If Expert Vision asks how experts perceive complex environments, Chromatic Symphony asks a playful cousin of that question: *what happens when we deliberately blur the channels?* Do we understand sound differently when we can see it? Do we remember color differently when we can hear it?

I do not know. I keep playing.

## Standards and Thinking Tools: AUDP and REDLINE Notes

Some side projects are games. Others are **infrastructure for conscience**.

The [AI Usage Declaration Protocol](https://github.com/JamalYusuf/AI-Usage-Declaration-Protocol) (AUDP) is my attempt to give website owners a voice in the AI era — a simple, machine-readable file that says, clearly, how your content may be used for training, summarization, excerpting, and commercial AI reuse. As simple as `robots.txt`. As necessary, I think, as HTTPS once was.

I built it because the current default — scrape everything, apologize never — does not feel sustainable. Creators deserve clarity. AI developers deserve signals they can act on. The web deserves a permission layer that is technical, not just legal.

Will it become a standard? I hope so. Standards are not born in conference rooms alone. They start as a file in `.well-known/` and a person stubborn enough to document it properly.

[REDLINE Notes](https://github.com/JamalYusuf/REDLINE-Notes) is more personal. A sharp, zero-radius Markdown editor that feels like sitting inside VS Code — tabs, command palette, workspace folders, live preview — but opens from a single `index.html` with no install and no account. I write in it. I think in it. The red accent is not decoration; it is a reminder to write with intent.

Tools shape thought. I wanted one that respected the way I already think when I am deep in a problem: keyboard-first, structurally aware, allergic to friction.

## What They Have in Common

If you squint, the pattern is obvious.

ChillStep Radio protects **attention**. Eyes and Annotate Pro improve **perception and communication**. White Dot Chaos and Chromatic Symphony probe **decision and sense-making through play**. AUDP defends **authorship in an automated world**. REDLINE Notes gives **thinking a home**.

None of these replaced my day job. All of them made me better at it.

Enterprise AI platforms ask: how do we deploy agents safely at scale? Expert Vision asks: how do experts actually see? My side projects live in the stretch between those questions — small enough to ship on a weekend, honest enough to reveal what I really care about.

## An Open Question

I keep coming back to this: **we talk about AI augmenting human expertise, but we build surprisingly little that studies how humans actually work before the augmentation arrives.**

Maybe that is the through-line. Not the Go binaries or the Chrome manifests or the quantum checkbox — but the habit of noticing. Building something small. Watching how it feels to use. Asking what it reveals about cognition, learning, focus, fairness, play.

So — what are your side projects really about?

Not the README description. The question underneath. The one you would keep building even if no one starred the repo.

I would love to know. In the meantime, mine are here — forkable, playable, installable, and very much still evolving.

**Explore the projects:** [Open Source & Experiments](/work/open-source/)