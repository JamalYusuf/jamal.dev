---
title: AI Systems & Agents
layout: work-section
work_types: ["AI Systems"]
summary: Production LLM orchestration, multi-agent workflows, and enterprise AI platform design in regulated environments — where demos die and discipline wins.
---

Here is a truth I have learned the hard way: **most enterprise AI does not fail because the model is weak. It fails because the system around the model is naive.**

A chat box on top of a PDF dump is not an agent. It is a party trick with compliance risk. Production AI in healthcare — or any regulated domain — needs the same rigor we demanded of payment APIs and claims pipelines a decade ago. Observability. Governance. Fallback paths. Cost controls. Human-in-the-loop where it matters. And above all, **integration with the systems experts already trust**.

## What I build

My AI systems work sits at the intersection of distributed engineering and human expertise. I design platforms where:

- **Agents are first-class services**, not UI ornaments — concurrent execution, structured outputs, validation, tracing, and attribution for every invocation.
- **Retrieval respects how experts actually read** — hierarchy, structure, and relationships before flat chunks. (If you have read my Expert Vision research, you know why this matters.)
- **Governance enables speed** — tiered risk classification, reusable compliance patterns, and shared prompt libraries so teams move fast *inside* guardrails instead of around them.
- **Failure is designed, not discovered** — circuit breakers for model outages, cost-aware routing, PII detection, and incident playbooks that match how operators actually work.

## The healthcare reality

At Centene, the stakes were never abstract. Agents needed to interact with claims, membership, and payment flows — real-time data, real latency SLAs, real audit requirements. That environment does not forgive architectural hand-waving.

So we built orchestration in Go. We wired agents into Kafka-fed operational context and governed lakehouse retrieval. We instrumented everything. We made deployment repeatable — from weeks of bespoke integration to days using shared primitives.

## A question I keep asking

If an expert engineer sat down with your AI system tomorrow, would it **amplify** their judgment — or ask them to babysit a probabilistic intern?

That question keeps me honest. It is the standard I hold production agent platforms to. Not "does it demo well?" but **does it earn trust under pressure?**

The selected work below reflects that standard in practice.