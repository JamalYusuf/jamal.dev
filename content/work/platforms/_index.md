---
title: Platforms & Infrastructure
layout: work-section
work_types: ["Platforms"]
summary: Event-driven pipelines, lakehouse platforms, and the backbone systems that AI workloads depend on — because intelligence without infrastructure is just inference.
---

People talk about AI as if it floats above the stack. It does not. It stands on **data that is trustworthy, pipelines that are reliable, and governance that is real** — not slide-deck real, production real.

I have spent years on the unglamorous center of enterprise technology: the event backbone, the lakehouse, the catalog, the access model, the operational runbook. The stuff that only makes headlines when it breaks. In my experience, that is exactly where senior engineering leverage lives.

## The nervous system

Think of platforms as a nervous system. Kafka streams are the signals — membership changes, payment events, claim updates, operational telemetry — moving in real time. The lakehouse is the memory — historical context, governed tables, lineage you can defend in an audit. APIs are the reflexes — bounded, testable, observable interfaces that other systems (including agents) can rely on.

When any of those layers lies, everything upstream lies too. Your dashboard is wrong. Your agent retrieves garbage. Your on-call engineer burns out chasing ghosts.

## What platform work actually means

Platform engineering, the way I practice it, is not "build internal tools and hope teams adopt them." It is:

- **Establishing patterns** — idempotent consumers, schema evolution, dead-letter handling, and deployment standards that reduce cognitive load for every team that follows.
- **Making data legible** — Unity Catalog, lineage, access policies, and interfaces that answer "where did this come from?" without a three-day investigation.
- **Bridging streaming and analytics** — operational Kafka feeds and analytical lakehouse tables connected through contracts, not tribal knowledge.
- **Designing for the next workload** — even when "the next workload" was not AI when you started. Good platforms create optionality.

## Scale is a leadership problem too

Rebuilding the Kafka event backbone was not only a technical program. It was a team program — scaling from one engineer to twelve while keeping availability above 99.9% and processing millions of healthcare events daily. Platform work at scale is **systems plus people plus habits**. You cannot separate them.

## Why this matters for AI

RAG without governed data is roulette. Agents without reliable event context are guessers with good marketing. Fine-tuning on uncataloged datasets is a liability wearing a lab coat.

The platform work below is what makes responsible AI possible — not as a slogan, but as an architecture you can explain to compliance at 9 a.m. on a Tuesday.