---
name: security
description: Application security standards, OWASP compliance, XSS prevention, CSRF safeguards, cryptographic password hashing with bcrypt, DPDP Act 2023 compliance, and session guards.
version: 1.0.0
---

# Application Security Standards

## 1. Input Sanitization & XSS Prevention
- Sanitize HTML tags and script injections before persistence.
- Enforce strict Content-Security-Policy headers and HTTP-only cookie flags.

## 2. Authentication & Authorization
- Use bcrypt with work factor >= 12.
- Protect administrative routes with cryptographic JWT / NextAuth session validation.
- Audit log all mutation events with timestamp, user ID, IP address, and entity ID.

