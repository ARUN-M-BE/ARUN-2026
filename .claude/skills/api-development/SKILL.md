---
name: api-development
description: RESTful API design, rate limiting, Zod schema validation, unified error/response envelopes, and status codes.
version: 1.0.0
---

# API Development Principles

## 1. Unified Response Envelope
- Success Response:
  ```json
  {
    "data": { ... },
    "meta": { "page": 1, "total": 100 }
  }
  ```
- Error Response:
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Human readable summary",
      "details": [{ "field": "email", "message": "Invalid format" }]
    }
  }
  ```

## 2. Validation & Security
- Validate all incoming payloads with Zod schemas.
- Sanitize inputs to prevent XSS.
- Implement rate limiting with sliding-window or token bucket to prevent abuse.

