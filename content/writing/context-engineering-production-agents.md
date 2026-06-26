---
title: "Context Engineering for Production Agentic Systems"
date: 2026-06-20
categories: ["AI Engineering", "Agentic Systems"]
tags: ["context-engineering", "llm", "rag", "multi-agent-orchestration", "prompt-engineering", "go", "production-ai"]
description: "Beyond prompt engineering lies context engineering — the systematic design of memory, state, retrieval contracts, and compression layers that turn brittle LLM workflows into reliable, observable, enterprise-grade agentic platforms."
readingTime: 17
toc: true
draft: false
---

There is a moment in every complex AI project when the prompts stop working.

You have beautiful ReAct loops. You have tool schemas. You have a vector store full of relevant documents. And yet the agent drifts. It forgets constraints three turns in. It hallucinates policy details it was explicitly told. It loses the thread between a membership eligibility check and the downstream claims adjustment it was supposed to trigger.

This is not a prompting problem. It is a **context problem**.

In my work leading enterprise Generative AI adoption — first rebuilding mission-critical real-time systems at Centene, then designing production agent platforms on Databricks, Snowflake Cortex, and AWS Bedrock — I have come to see context engineering as the discipline that separates demos from systems that survive incident command at 2 a.m.

## The Context Budget Is Real

Every LLM call has a finite window. More importantly, every *agentic workflow* has a finite *attention budget* before quality degrades, cost explodes, or compliance risk appears.

Experts in high-stakes domains (the ones I study through the Expert Vision framework) do not hold everything in working memory. They maintain **hierarchical mental models**: a small active workspace, episodic recall triggered by cues, and deep semantic structures they only surface when needed.

Our agents need the same architecture.

### Pattern 1: Layered Memory Architecture

Instead of one giant context window or a single vector collection, design three explicit layers:

1. **Active Scratchpad** (short-term, in-prompt or Redis-backed)
   - Current plan, open tool calls, recent observations
   - Strict size limit (e.g., last 8k tokens)
   - Fast mutation, easy to summarize or evict

2. **Episodic Memory** (vector store with strong metadata)
   - Past decisions, tool results, user corrections
   - Filtered by session, user role, compliance tags (HIPAA-relevant fields never leave the secure boundary)
   - Retrieved with reranking + recency + relevance scoring

3. **Semantic / Procedural Memory** (knowledge graph or curated corpus + few-shot exemplars)
   - Policy documents, schema definitions, successful agent trajectories
   - Versioned and governed (Unity Catalog or Snowflake governance layer)

In Go, this looks like a simple state machine struct that you can snapshot, diff, and persist:

```go
type AgentContext struct {
    SessionID     string
    ActivePlan    Plan
    Scratchpad    []Observation
    EpisodicIDs   []string          // vector store keys
    PolicyVersion string
    CostSoFar     float64
    // ...
}

func (c *AgentContext) SummarizeForPrompt(maxTokens int) string {
    // hierarchical compression: keep recent + high-signal older items
}
```

The key is that **summarization itself is a governed tool call**, not an invisible LLM behavior.

## Context Contracts via Structured Outputs and Tool Schemas

One of the highest-leverage moves I have seen is treating tool definitions and structured output schemas as **context contracts**.

When you define a tool in OpenAI or Anthropic format (or Bedrock Converse API), you are not just describing a function. You are declaring:

- What state the agent is allowed to mutate
- What invariants must hold after the call
- What metadata must travel with the result for downstream observability and audit

At Centene, when we productionized agents over real-time membership and payment pipelines (Kafka topics we had spent years hardening), the difference between fragile and reliable agents often came down to one thing: **every tool response carried a context envelope** — correlation ID, policy version at time of execution, data freshness timestamp, and a machine-readable “confidence / risk” classification.

This made it possible to implement proper saga patterns and compensation logic when a downstream agent step failed.

## Dynamic Context Compression and Hierarchical Summarization

Long-running agents (especially those handling multi-turn healthcare workflows) need compression that is **lossy but auditable**.

Techniques that have worked well in practice:

- **Progressive summarization** at natural boundaries (after tool batch, after human handoff, after policy checkpoint)
- **Metadata-aware compression**: keep full fidelity on compliance-critical fields; aggressively summarize narrative
- **Contrastive summarization**: “What changed since last checkpoint?” rather than full rewrite
- **Evaluation-gated compression**: only accept a summary if an LLM-as-judge (or cheaper model) confirms it preserves key entities and decisions

I have found Claude’s extended thinking + structured output mode particularly effective here because you can ask it to produce both the summary *and* a structured “key facts delta” object in one call.

## Multi-Agent Handoffs and Shared Context Blackboards

When you move from single agent to orchestrated multi-agent systems (supervisor + specialist agents), context becomes a distributed systems problem.

The patterns that scale:

- **Blackboard architecture**: a shared, versioned context store (Postgres + listen/notify, or Redis streams) where agents post observations and claims. Each agent subscribes only to relevant topics.
- **Handoff packets**: explicit, signed context bundles passed between agents containing “what I know”, “what I decided”, “what I need you to verify”, and provenance.
- **Supervisor as context governor**: the supervisor maintains the global plan and decides which agent gets which slice of context, enforcing budget and policy.

In Go, this maps beautifully to goroutines + channels + a central context broker. The same concurrency primitives that made our Kafka consumers reliable at Centene now make agent swarms controllable.

## Observability: You Cannot Engineer What You Cannot See

Context engineering without observability is just expensive prompting.

Every production system I have helped stand up includes:

- Full trace of context construction (which memories were retrieved, which were summarized, token counts per layer)
- Attribution of cost and latency to specific context decisions
- “Context health” metrics: compression ratio, information loss estimates (via judge models), policy violation near-misses
- Replay capability: given a trace ID, reconstruct the exact context window that was sent to the model at any step

This is where the 15+ years of backend reliability engineering pays off. The same distributed tracing discipline (correlation IDs flowing from Kafka events through microservices into LLM calls) turns mysterious agent failures into debuggable incidents.

## The Human in the Context Loop

Context engineering is ultimately about **respecting expert cognition**.

In regulated domains, the goal is rarely full autonomy. It is **expertise amplification**: the agent should surface the right anchors first (exactly as an experienced claims adjudicator or clinician does), maintain the invariants the expert cares about, and make the handoff to human judgment frictionless and information-rich.

This is why I keep coming back to the Expert Vision research program in my independent practice. When I watch experts work — whether through eye-tracking from my earlier career, competitive gaming telemetry, or simply sitting with engineers during incident calls — the pattern is consistent: they do not process more information. They **maintain better context**.

Our job as AI platform engineers is to give agents the same disciplined context hygiene.

## Practical Starting Point

If you are shipping agentic systems today, begin with these three moves:

1. Audit your current prompts for implicit context assumptions. Make them explicit data structures.
2. Introduce one governed compression step (even a simple “summarize recent observations” tool) and measure the effect on both quality and cost.
3. Add correlation IDs and basic context metadata to every tool call and LLM invocation. You will thank yourself at the first real incident.

The agents that survive production are not the ones with the cleverest prompts. They are the ones with the cleanest, most intentional context architecture.

That architecture is what context engineering is for.

---

*If you are building production agentic systems and want to go deeper on the Go orchestration patterns or the governance layer we used at enterprise scale, I am always happy to compare notes. The work is too important to do in isolation.*
