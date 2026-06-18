---
title: Kafka Event Backbone
date: 2023-06-01
layout: work-post
work_types: ["Platforms"]
summary: Rebuilding a mission-critical event streaming platform that became the organization's nervous system — and later, the feed AI agents could trust.
technologies: [Kafka, Kubernetes, Go, Schema Registry, OpenTelemetry]
outcomes:
  - Scaled engineering team from 1 to 12 while maintaining 99.9% pipeline availability.
  - Processed millions of healthcare events daily with sub-second end-to-end latency.
  - Established patterns later reused for real-time AI agent data feeds.
  - Implemented schema governance, idempotent consumers, and dead-letter handling as organizational standards.
  - Produced operational runbooks and on-call practices adopted across downstream platform teams.
---

The event backbone was not built for AI. AI could not have been built without it.

I want to say that plainly because platform work rarely gets credit in the moment. It is invisible when it works — like a good referee. You only feel it when it is gone.

## Why events, not just APIs

Healthcare operations do not sit still. Membership changes. Payments post. Claims move through states. Dashboards lag if you only poll. **Events are how reality announces itself** — if you have the discipline to listen.

Kafka became that listening layer: millions of events daily, sub-second end-to-end latency, schemas that evolved without breaking consumers who had not read your Slack message.

## Rebuilding while the plane flies

We scaled the team from one engineer to twelve during this program. That is not a vanity metric. It reflects the truth of platform recovery — you are simultaneously **fixing the foundation and teaching a crew how to maintain it**.

Availability stayed above 99.9% because we treated operations as design, not aftermath. Idempotent consumers. Dead-letter queues with real triage. Schema registry policies that prevented "quick fixes" from becoming tomorrow's outage.

## Patterns that compound

The patterns we established — consumer design, retry semantics, observability hooks, deployment standards — became the organization's shorthand for "how we do distributed systems here." Later AI workloads reused the same feeds because **trust was already deposited**.

That is the compounding return on platform work. You are not only moving bits. You are reducing the cognitive tax on every team that follows.

## A metaphor I keep using

Kafka is the nervous system. Lakehouse is memory. APIs are reflexes. Agents, when they finally arrived, needed all three — but the nervous system had to be trustworthy first.

## What I would tell any principal engineer

If your leadership asks when to invest in event infrastructure, the honest answer is: **before you need it for the headline workload**. The headline always arrives late and impatient.

Build the backbone when the organization still has enough calm to do it right. Your future self — and your future agents — will thank you.