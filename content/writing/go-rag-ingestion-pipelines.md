---
title: "The Boring Go Layer Between Your RAG Demo and Production"
date: 2026-06-17
categories: ["Engineering"]
tags: ["go", "rag", "ingestion", "kafka", "enterprise"]
description: "RAG demos live in notebooks. Production RAG lives in ingestion pipelines — and I keep choosing Go for the unglamorous middle."
readingTime: 14
filter: engineering
draft: false
---

RAG demos are seductive. Chunk a PDF. Embed. Retrieve. Watch the answer sparkle. Applause. Next slide.

Production RAG is a **pipeline problem** — documents that change, access policies that differ by team, embeddings that stale, audits that ask where a paragraph came from three quarters ago. The demo never shows that part. The on-call engineer lives there.

I keep choosing Go for the unglamorous middle between source systems and vector indexes. Not because Python cannot embed. Because **operations is a language choice too**.

## Ingestion is event-driven, not cron-shaped

Documents do not arrive on a polite schedule. Policies update. Contracts renew. Clinical guidelines revision themselves the week before go-live. You need ingestion that reacts — Kafka events, webhooks, CDC streams — with idempotent workers that can replay without duplicating the universe.

Go workers handling embed jobs feel familiar if you have run Kafka consumers before: bounded concurrency, clear backpressure, dead-letter queues for poison documents, metrics that mean something at 3 a.m.

A nightly cron script is fine until it isn't — until someone asks why the agent quoted last year's formulary.

## Govern before you embed

In healthcare and other regulated domains, the question is not "can we vectorize this?" It is **"are we allowed to, and for whom?"**

The ingestion layer must enforce catalog rules before embeddings land in a shared index. Unity Catalog, access tags, document classification — whatever your governance model, it belongs **upstream** of the embedding call, not as a post-incident apology.

Go services wired to your access layer make that enforcement boring and repeatable. Boring is good. Boring ships.

## Hierarchy beats flat chunks — in code too

Expert Vision research keeps confirming what practitioners already feel: experts read structure first. Your ingestion code should preserve it — headings, sections, tables, cross-references — not amputate documents into arbitrary 512-token slices and call it intelligence.

I store chunk metadata rich enough to rebuild context: source path, heading trail, page, policy version, effective date. Retrieval quality is a **data modeling** problem before it is an embedding model problem.

## Observability for the silent failure

The worst RAG failures are quiet — stale indexes, partial ingests, wrong-environment embeddings, documents silently skipped because a parser choked on a table.

Instrument ingestion like you instrument payments: rows processed, failures by reason, lag from source update to index freshness, cost per million tokens embedded. Dashboards for the humans. Alerts before members notice.

## Demo to production

If your RAG architecture cannot answer "what changed, when, and who was allowed to see it?" you do not have enterprise retrieval. You have a search bar with ambition.

Go will not write your prompts. It will help you **run the pipeline** that makes prompts trustworthy — one governed, replayable, observable document at a time.

That is the boring layer. It is also the whole game.