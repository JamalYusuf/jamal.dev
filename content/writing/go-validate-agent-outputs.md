---
title: "Validating Agent Outputs in Go Before They Touch Production"
date: 2026-06-14
categories: ["Engineering"]
tags: ["go", "llm", "validation", "agents", "structured-output"]
description: "Structured outputs, schema validation, and the boring Go layer that keeps probabilistic agents from becoming probabilistic incidents."
readingTime: 13
filter: engineering
draft: false
---

An agent that sounds right is the most dangerous kind of wrong.

I have seen it in healthcare workflows — confident JSON, clean prose, a downstream system that accepts the payload and only screams twenty minutes later when reconciliation fails. The model did its job. The **system** failed to treat probability like probability.

In Go, I fix that with a boring layer between the model and the world: **validate before side effects**. Always.

## Structured output is a contract, not a suggestion

When an agent triggers a claim update, a membership change, or a payment handoff, I want a typed struct — not a vibes-based map parse. Define the contract. Generate or hand-write the schema. Unmarshal. Validate.

Go's static typing is not about elegance in a slide deck. It is about **refusing to ship ambiguity** into systems that expect determinism at the boundary.

JSON from an LLM is a proposal. Your validator is the bouncer.

## Validate semantics, not just syntax

Schema validation catches missing fields. Good. It does not catch a plausible member ID from the wrong region, a date in the wrong century, or an action code that is legal JSON and illegal in your domain.

Layer validation:

- **Syntactic** — required fields, types, enums, string lengths
- **Semantic** — business rules, cross-field constraints, authorization scope
- **Operational** — idempotency keys, duplicate detection, rate limits before writes

The model should never be the last line of defense for member data. That is not mistrust. That is **architecture**.

## Fail closed, log rich

When validation fails, fail closed. Do not pass partial structs to payment APIs because "most of it looked fine." Log the failure with trace IDs, model version, prompt hash, retrieval sources — enough to debug without exposing PII in plain text.

In regulated environments, that log is how you survive the Tuesday morning review. "The model said so" is not a root cause. **"Validation rejected field X at step Y"** is.

## Reuse patterns across teams

The win at enterprise scale is not one perfect validator. It is a **shared validation kit** — common error types, retry policies for transient model formatting glitches, human-review queues for high-risk rejections.

Teams ship agents faster when they are not each inventing their own JSON prayer circle.

## The uncomfortable standard

Would you let this unmarshaled struct touch a production database without a human in the loop?

If not, build the validator first. Models will keep getting better. Your compliance obligations will not get more patient.

Go makes that discipline feel natural — compile the contract, enforce the contract, **then** let the model speak.