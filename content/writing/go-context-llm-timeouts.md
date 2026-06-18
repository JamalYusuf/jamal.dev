---
title: "Context Is the Kill Switch: Go, Cancellation, and LLM Timeouts"
date: 2026-06-10
categories: ["Engineering"]
tags: ["go", "llm", "context", "timeouts", "agents"]
description: "Why context.Context is the most underrated tool in production LLM orchestration — and what happens when you forget the kill switch."
readingTime: 12
filter: engineering
draft: false
---

The first time I watched an agent runaway eat a month's inference budget in an afternoon, nobody blamed the model. They should have blamed **the missing kill switch**.

The model kept going because nothing told it to stop. Tool calls chained. Retries compounded. Goroutines — or their equivalent — waited politely for a provider that had already left the building.

In Go, the kill switch has a name: `context.Context`. And I think it is the most underrated tool in production LLM orchestration.

## Every LLM call is a network call

We talk about models like they are thoughts. In production they are **HTTP requests with variance** — slow ones, hung ones, expensive ones, ones that succeed just enough to trigger another call.

`context.WithTimeout` is not bureaucracy. It is how you tell the system: this invocation has a maximum lifespan. When time is up, downstream work stops. Not eventually. **Now.**

That matters when one user action fans out into twelve retrieval hops, four tool calls, and two validation passes. Without propagation, you get orphan work — the distributed systems version of leaving every light on in the house.

## Propagate or pay

The mistake I see repeatedly: a timeout on the outer handler, but inner goroutines launched without the derived context. They keep running after the client disconnects. They keep billing after the human closed the tab.

In Go, the fix is cultural and mechanical. Pass `ctx` as the first argument. Check `ctx.Done()` before side effects. Use `context.WithCancel` when a human hits "stop." Wire cancellation through your retrieval client, your Bedrock wrapper, your Kafka publish — the whole chain.

If only the top of the stack respects cancellation, you do not have cancellation. You have **theater**.

## Timeout budgets, not one big number

A single 120-second timeout feels generous until you stack six sequential calls and wonder why the member is still waiting.

I prefer **per-step budgets** inside an overall ceiling: 8 seconds for retrieval, 15 for the first model pass, 5 for validation, with a parent context capping the whole flow at 45. When a step overruns, you fail fast and degrade gracefully — cached answer, human escalation, read-only mode.

That is not pessimism. It is **operational empathy** for the person on the other end of the SLA.

## The question I ask in code review

If the provider hangs and the user abandons the request, does work stop?

If the answer is "probably," you do not have an LLM problem. You have a concurrency problem — and Go already gave you the primitive. You just have to use it like you mean production.

Context is not boilerplate. It is the difference between an agent that respects time and one that **eats it**.