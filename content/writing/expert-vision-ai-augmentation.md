---
title: "Expert Vision: Cognitive Foundations for Human-AI Collaboration"
date: 2026-06-24
categories: ["Cognitive AI", "Human-AI Interaction", "Agentic Systems"]
tags: ["expert-vision", "cognitive-science", "human-ai-collaboration", "agent-evaluation", "responsible-ai", "eye-tracking", "decision-making"]
description: "What fifteen years of studying how experts perceive, decide, and perform under pressure — from eye-tracking systems to competitive gaming to enterprise AI platforms — teaches us about building agents that genuinely extend expertise rather than merely automate tasks."
readingTime: 15
toc: true
draft: false
---

Most AI tooling conversations begin with the model.

I prefer to begin with the expert.

Before I ever worked on large-scale backend systems or Generative AI platforms, I spent years building eye-tracking and cognitive systems at LC Technologies. I watched how radiologists, air traffic controllers, competitive gamers, and software engineers actually move their eyes, allocate attention, and make decisions under uncertainty. Later, through the Expert Vision research practice I founded, I formalized this into a framework for capturing, modeling, and transferring expert performance.

That background now shapes everything I build in AI.

Because the uncomfortable truth is this: most current agentic systems are designed around what the *model* can do, not around how *experts actually think*. The result is tools that feel impressive in demos and exhausting or opaque in real workflows.

## How Experts Actually Work

Through eye-tracking studies, behavioral telemetry from high-performance domains, and direct observation, a few patterns emerge consistently:

**Experts anchor on structure first.** They do not read linearly. They rapidly identify the skeleton of a problem — the relevant entities, the constraints, the decision points — before filling in details.

**Experts maintain sparse, high-fidelity working memory.** They do not hold everything. They hold the right things and know exactly where to look when they need more.

**Experts simulate and backtrack.** Good decisions often come from running quick mental simulations and discarding paths that violate invariants, not from exhaustive search.

**Experts feel the weight of uncertainty.** They have calibrated internal signals for “this needs more scrutiny” or “this is safe to delegate.”

**Experts externalize.** They use tools, notes, colleagues, and environmental cues to extend their cognition.

Any AI system that hopes to augment rather than replace expertise must respect these patterns.

## Implications for Agent Design

### 1. Perception Layers Before Reasoning Layers

Most ReAct-style agents jump straight to reasoning. Experts do not.

In practice, this means building explicit **perception agents** or stages whose job is to surface structure:

- Entity and relation extraction tuned to the domain’s ontology
- Attention-like retrieval: “what would an expert look at first in this document or dashboard?”
- Visual or structural summarization (inspired by how experts scan pages, diagrams, and code)

The eye-tracking work I did earlier in my career made one thing obvious: experts often make the right call in the first 3–8 seconds of exposure because they know where to look. Our agents should have that same fast-path perceptual intelligence.

### 2. Context as Curated Workspace, Not Document Dump

This is where context engineering (the subject of my previous post) meets cognitive science.

Instead of stuffing the entire relevant corpus into the prompt, design the agent’s active context as a **curated workspace** that mirrors an expert’s mental model:

- A small number of high-signal “anchor” facts or entities
- A short list of open questions or invariants to protect
- Recent observations, explicitly linked to the anchors
- Clear provenance and uncertainty markers on every item

When I review agent traces from production systems, the ones that feel “expert-like” are the ones where the context window reads like a senior engineer’s scratchpad, not like a search engine results page.

### 3. Decision Evaluation That Includes Cognitive Load

Current LLM evaluation mostly measures output correctness against a reference or via LLM-as-judge on isolated criteria.

Expert Vision suggests a richer set of questions:

- Did the agent surface the right anchors early, or did it force the human to do heavy perceptual work?
- Did it reduce or increase the expert’s working memory burden?
- Did it make the uncertainty visible and actionable?
- Would a domain expert, given only the agent’s context slice, reach a similar conclusion in similar time?

These are harder to measure, but they are the metrics that actually predict whether an AI system will be adopted and trusted in high-stakes environments.

In healthcare payer workflows, for example, we found that agents which explicitly called out “policy version at decision time” and “data freshness” dramatically reduced the cognitive verification load on human reviewers — even when the final recommendation was sometimes overridden.

### 4. Play and Exploration as Evaluation

Some of the most useful signals about expert cognition come from play.

In the Expert Vision program I run experiments with systems like White Dot Chaos (a canvas game with optional quantum entropy) and Chromatic Symphony (synesthetic interfaces). These are not just art projects. They are controlled environments for studying how people make decisions under varying levels of uncertainty, how cross-modal feedback changes perception, and how experts develop intuition.

The same spirit applies to agent evaluation. Create sandbox environments where experts can safely probe the agent’s behavior across edge cases, and instrument everything. Watch where they intervene, what they override, and what they trust immediately. That data is gold for improving both the agent and the handoff interface.

## Responsible AI Starts with Respect for Expertise

In regulated domains, “responsible AI” often gets reduced to bias testing and output filtering.

Those are necessary but insufficient.

True responsibility includes:

- Never pretending the agent has expertise it does not
- Making the limits of its context and reasoning visible
- Designing for graceful degradation to human judgment
- Studying how the presence of the agent changes expert behavior over time (deskilling is a real risk)

The eye-tracking and accessibility work from my time at Eyegaze taught me that the best interfaces do not just present information — they respect the user’s perceptual and cognitive reality. The same principle applies to agentic systems.

## Bringing It Back to Production Platforms

When I led Generative AI adoption at Centene, the most successful initiatives were the ones that treated expert cognition as a first-class design constraint.

We did not just deploy agents over Kafka pipelines and Databricks feature stores. We asked:

- What does an expert claims adjudicator or care manager actually need to see in the first screen?
- Where do they currently spend unnecessary cognitive effort verifying data freshness or policy applicability?
- How can the agent make the “why” behind its recommendation as crisp and verifiable as the recommendation itself?

The answers to those questions drove the context architecture, the guardrail design, the tracing strategy, and the human-in-the-loop patterns far more than raw model benchmarks ever did.

## An Invitation

If you are building AI systems that interact with experts — whether in healthcare, engineering, finance, operations, or creative work — I encourage you to spend time studying how those experts actually perceive and decide before you optimize the model.

Read the eye-tracking literature. Instrument real workflows (ethically). Build small probes and watch where experts intervene. Treat evaluation as a cognitive science problem, not just an ML problem.

The agents that will matter in the next decade are not the ones that score highest on generic benchmarks. They are the ones that make experts faster, more confident, and more effective at the edge of their expertise — while remaining humble about their own limits.

That is what Expert Vision is ultimately about. And it is the foundation on which I believe the most valuable production AI platforms will be built.

---

*If your team is thinking about how to move from impressive agent demos to systems that experts actually want to collaborate with every day, I would value the conversation. The gap between the two is where the real engineering — and the real human impact — lives.*
