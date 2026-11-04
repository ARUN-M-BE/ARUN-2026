---
name: testing-qa
description: Quality assurance, automated unit testing, end-to-end integration tests, type verification, and regression prevention.
version: 1.0.0
---

# Testing & QA Standards

## 1. Automated Test Suites
- Unit test cryptographic helpers, slugifiers, sanitizers, and Zod validators.
- Test API envelopes, status codes, and rate limiter throttling.
- Graceful database mock assertions.

## 2. Type Checking & Build Verification
- Zero TypeScript warnings or `any` compromises (`tsc --noEmit`).
- Production build passes with zero fatal webpack/turbopack panics.
