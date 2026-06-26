---
title: "Reliability Engineering for Generative AI Platforms"
date: 2026-06-22
categories: ["Production AI", "MLOps", "Agentic Systems"]
tags: ["reliability", "observability", "guardrails", "incident-response", "aws-bedrock", "databricks", "kafka", "go", "production-ai"]
description: "Fifteen years of distributed systems, real-time pipelines, and incident command applied to LLM platforms. How to build agentic systems that degrade gracefully, contain failures, and remain auditable when everything is on fire at 2 a.m."
readingTime: 16
toc: true
draft: false
---

The first time an AI agent I helped put into production caused a visible incident, it did not fail dramatically.

It failed quietly.

A claims adjustment agent, under load, began making decisions based on slightly stale eligibility data. The downstream payment system accepted the decisions. Finance noticed the variance three days later. By then we had processed thousands of incorrect adjustments.

There was no stack trace. No obvious error rate spike. Just a slow, silent drift in the quality of context the agent was operating on.

That experience — and many others like it while serving as incident commander for company-wide outages at Centene — taught me that **reliability engineering for generative AI is not primarily about model accuracy**. It is about **containing uncertainty, preserving invariants, and making every automated decision debuggable and reversible**.

This is the same discipline that made our Kafka-based real-time membership and payment pipelines trustworthy. The difference is that now the “compute” layer includes non-deterministic LLM calls.

## The AI Incident Commander Mindset

Traditional SRE assumes deterministic systems. AI systems are probabilistic and context-dependent.

When I step into incident command for an AI-related outage, I ask a different set of questions:

- Which *context slice* was the agent operating on when the bad decision was made?
- What was the policy version, data freshness, and tool response envelope at that moment?
- Could a human expert, given the same context window, have made the same mistake?
- What guardrail or circuit breaker should have fired but did not?

The tooling has to answer these questions in seconds, not hours.

## Core Reliability Patterns for Agentic Systems

### 1. Circuit Breakers and Bulkheads for Tool Calls and LLM Invocations

Every external dependency — whether a vector search, a claims lookup API, or the LLM itself — gets a circuit breaker.

In Go I typically use a combination of `gobreaker` (or a lightweight custom implementation) per tool type, with per-tenant and per-policy-version overrides.

```go
type ToolCircuitBreaker struct {
    breaker *gobreaker.CircuitBreaker
    // metrics, fallback behavior, policy version awareness
}

func (t *ToolCircuitBreaker) Execute(ctx context.Context, fn func() (any, error)) (any, error) {
    // record context metadata on every attempt and fallback
}
```

When the breaker opens, the agent does not just error. It takes a **defined degraded path**:
- Fall back to a cheaper/faster model
- Return a “needs human review” structured output
- Emit a high-priority alert with the exact context that triggered the open

This is how you prevent one flaky tool from cascading into a full platform incident.

### 2. Distributed Tracing Across LLM + Backend Boundaries

You cannot debug what you cannot trace.

At minimum, every production AI system needs:

- A single correlation ID that flows from the triggering Kafka event (or API request) through every LLM call, every tool invocation, every agent handoff, and every downstream system write.
- LLM-specific spans that capture: model, prompt template version, context token count (by layer), temperature, tool calls requested, structured output schema, finish reason, and any guardrail interventions.
- Cost and latency attribution attached to the same trace.

Tools like LangSmith, Phoenix, or a custom OpenTelemetry + ClickHouse setup work. The important part is that the trace is **queryable by business outcome** (“show me all traces where a claims adjustment was auto-approved but later reversed”) not just by error rate.

### 3. Guardrails as First-Class Infrastructure

Guardrails are not a nice-to-have. They are the compliance and safety equivalent of input validation and authorization checks in traditional systems.

Effective patterns I have seen work at scale:

- **Pre-inference guards**: PII detection, prompt injection classifiers, policy compliance classifiers (especially important in healthcare).
- **Post-inference guards**: hallucination/contradiction detectors against source context, output schema validators, business rule engines that run *after* the LLM but *before* any state mutation.
- **Constitutional-style self-critique** for high-stakes decisions, with the critique model running under a different circuit breaker.

AWS Bedrock Guardrails and similar managed services are excellent starting points. The real maturity comes when you treat guardrail *violations* as first-class observability events — not just blocks.

### 4. Saga and Compensation Patterns for Multi-Step Agents

Long-running agent workflows (eligibility → coverage check → adjustment recommendation → approval routing) are distributed transactions.

When step N fails or a guardrail fires late, you need compensating actions.

The same event-driven thinking that powered our Kafka pipelines at Centene applies directly:

- Every agent decision is an event with full provenance.
- Compensating actions are themselves tool calls or human workflows triggered by those events.
- Idempotency keys are mandatory on any state-mutating operation.

This turns “the agent did something wrong” into “we have an auditable trail and a defined recovery path.”

## Governance and the Human Override Layer

In regulated environments, the reliability contract includes the right for a human to intervene *with full context*.

That means:

- Every automated decision surfaces a “why” packet (the minimal context slice + key facts + policy citations) that a human reviewer can consume in < 30 seconds.
- Override actions are logged with the same correlation ID and can trigger re-evaluation or compensation.
- The system makes the cost of human review explicit (time, cognitive load) so you can optimize the handoff points.

This is where my background in eye-tracking and cognitive systems from LC Technologies and the Expert Vision research program informs the platform design. We are not just building reliable automation. We are building systems that respect how experts actually allocate attention under time pressure.

## FinOps and Cost Containment as Reliability Concerns

An agent that quietly burns $4,000/day in token spend because of unbounded context growth or retry storms is not reliable — it is a liability waiting to be discovered in the next budget review.

Production AI platforms need:

- Per-workflow and per-tenant token budgets with graceful throttling
- Aggressive but governed caching (semantic cache + exact cache) before hitting the model
- Model routing: cheap/fast model for perception and classification steps, powerful model only when the context contract justifies it
- Real-time cost attribution in the same tracing system used for reliability

At Centene, the AI governance framework we built included FinOps dashboards right alongside reliability and compliance dashboards. They were the same conversation.

## Starting Small, Scaling Responsibly

If you are early in your AI platform journey, do not try to boil the ocean.

Pick one high-value, bounded workflow. Instrument it with correlation IDs and basic circuit breakers. Add one post-inference guardrail that actually blocks or routes to human review. Measure the incident rate and the review burden.

Then expand.

The organizations that succeed at production Generative AI are not the ones with the most advanced models. They are the ones that treat AI systems with the same rigor they apply to the rest of their distributed infrastructure — and then add the new disciplines of context engineering, guardrail design, and probabilistic debugging.

That rigor is what turns exciting demos into systems you can trust when real money, real compliance, and real human impact are on the line.

---

*This is the mindset I bring to every AI platform engagement. If your team is moving from pilot agents to production platforms and you want to avoid the silent drift incidents, I am happy to share more specific patterns from the systems we have shipped.*
