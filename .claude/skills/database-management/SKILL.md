---
name: database-management
description: High-reliability relational database architecture, Drizzle ORM patterns, connection pooling, migration resilience, and offline/demo fallback handling.
version: 1.0.0
---

# Database Management & Resilience Patterns

## 1. Resilience & Graceful Fallback
- Production systems must fail gracefully: if PostgreSQL is momentarily unreachable or when running in static/demo mode, repositories must return structured fallback data rather than crashing the user-facing application.
- Use connection pool timeouts (`connectionTimeoutMillis: 3000`) and handle query exceptions with try/catch fallback handlers.

## 2. Schema Normalization & Indexing
- Foreign keys with cascading rules (`onDelete: "cascade"`).
- B-Tree indexes on high-frequency lookup fields (`slug`, `status`, `sortOrder`, `createdAt`).
- Immutable audit trails for all mutating operations.

