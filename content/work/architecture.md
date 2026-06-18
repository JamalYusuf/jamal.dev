---
title: Architecture & Engineering
summary: Designing systems that are reliable, observable, governable, and built to last — in environments where failure has real consequences.
domains:
  - Go
  - Kafka & Event-Driven
  - Databricks Lakehouse
  - Snowflake Cortex
  - AWS Bedrock
  - Kubernetes
  - Observability & SLOs
  - API Design
impact:
  - Led enterprise-wide Generative AI platform adoption at Centene, integrating AI agents with real-time claims, membership, and payment systems.
  - Rebuilt a mission-critical engineering team from 1 to 12, establishing Kafka pipelines that became foundational for later AI workloads.
  - Modernized high-throughput membership and payment APIs serving millions of healthcare transactions with strict latency and compliance requirements.
  - Established AI governance frameworks, observability standards, and cost controls for LLM-powered systems in regulated environments.
  - Designed idempotent event consumers, dead-letter handling, and operational runbooks adopted as organizational patterns for distributed systems.
  - Bridged operational streaming data and analytical lakehouse platforms — giving AI systems access to both real-time and historical context through governed interfaces.
---

I have spent more than fifteen years building systems that cannot afford to be clever at the expense of being clear. In healthcare, telecom, and privacy-sensitive environments, the question is never just *can we ship it?* It is *will it still make sense at 3 a.m. when something breaks and someone's coverage depends on the answer?*

That mindset is what I bring to architecture.

## Systems as agreements

In my view, every production system is an agreement between teams, data, and time. APIs promise behavior. Pipelines promise delivery. Dashboards promise truth. When those promises drift, expertise erodes — engineers stop trusting the tools, operators stop trusting the metrics, and the organization starts making decisions on vibes instead of evidence.

Good architecture makes the agreements explicit. Contracts on events. Schemas with evolution rules. SLOs that mean something. Runbooks that match reality. Not because bureaucracy is virtuous, but because **clarity is a form of kindness** when the stakes are high.

## What I optimize for

I do not chase novelty for its own sake. I optimize for systems that:

- **Survive contact with reality** — retries, backpressure, circuit breakers, graceful degradation. The unglamorous bones that keep services standing when dependencies fail.
- **Stay observable** — if you cannot see it, you cannot govern it. Traces, structured logs, cost attribution, and error budgets are not extras. They are how adults run software.
- **Respect regulated context** — HIPAA is not a vibe. Access control, audit trails, data minimization, and output validation belong in the design, not the post-mortem.
- **Compound over time** — the best architectures get *easier* to extend, not harder. Shared primitives beat one-off heroics every single week.

## From events to intelligence

A pattern I have seen repeatedly: organizations try to bolt AI onto fragmented data and brittle pipelines, then wonder why agents hallucinate or stall in production. The architecture work that actually unlocks AI is often unsexy — **governed lakehouses, reliable Kafka backbones, well-defined service boundaries, and APIs that do not lie**.

The event backbone we rebuilt was not built for AI. AI could not have been built without it. That is the kind of foundation I care about — systems that create optionality without creating chaos.

## Expert Vision meets engineering

My research into how experts perceive and act in complex environments informs how I think about system design too. Experts do not read distributed systems linearly. They anchor on structure — boundaries, contracts, failure domains — before diving into implementation detail. Novices often do the opposite.

So I design for **structural legibility**: can a new engineer orient quickly? Can an operator diagnose without archaeology? Can a compliance reviewer trace data flow without a treasure hunt? If not, the architecture is asking humans to compensate for its ambiguity. That never scales.

## The through-line

Whether it is Go services at scale, Kafka pipelines carrying millions of healthcare events, or LLM orchestration wired into claims and membership systems — the through-line is the same. Build systems that make experts more effective. Make failure modes boring. Make success repeatable.

That is architecture, in my book. Not diagrams for their own sake. **Discipline made visible.**