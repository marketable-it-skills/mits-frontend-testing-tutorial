# Module 2: Complete Login Suite + Sign-in Helper

## Overview

Finish **Module G A1** by implementing the remaining login cases: invalid credentials, suspended accounts, and a successful sign-in that lands on stations with a visible session identity. You will also extract a small **`signInAsLin()`** helper so later specs can reuse a reliable login without copy-paste.

## What is client validation vs API error messaging?

- **Client validation** runs in the browser before a request (e.g. empty email → `Email is required`).
- **API errors** come back from the mock backend (e.g. `401 Invalid email or password`, `403 Account suspended`) and are shown in the same `login-error` region — but the **message text must differ** so assessors can tell the cases apart.

## What You'll Learn

- Complete the A1 login matrix from Module G
- Distinguish invalid credentials from suspended-account failures
- Assert authenticated landing (`stations-page`) and identity (`user-chip`)
- Extract a file-local `signInAsLin()` helper for reuse in Modules 3–4

## Why This Matters

Almost every later Module G Cypress spec needs a signed-in rider. A solid, isolated login suite plus a tiny helper saves time under competition pressure and prevents flaky “already logged in” failures.

## PRD Connection

Implements **§5.2 A1** (complete) and **§5.3 Seed data**.

## Prerequisites

- Module 1 complete (Cypress running, first two login tests green)
- SwapLoop template app startable via `node server.js`

## Time Estimate

⏱️ **2–3 hours**

## Module Structure

1. Review Module 1 login tests and seed accounts
2. Implement invalid credentials
3. Implement suspended account block
4. Implement successful sign-in → stations + user chip
5. Extract `signInAsLin()` helper
6. Isolation mini-lab (clear storage / reset)
7. Git feature-branch workflow

## Expected Result

Fully green `01_login.cy.js` (all five `it`s). Helper `signInAsLin` is available in the same file for later modules to copy or import patterns from.
