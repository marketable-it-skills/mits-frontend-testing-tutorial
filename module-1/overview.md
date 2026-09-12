# Module 1: Environment, Cypress Mental Model & First Login Assertions

## Overview

You will set up the SwapLoop **Cypress frontend-testing template**, learn how Cypress commands work, and implement the first two login specs from Module G Part A. By the end you have a running app, a green Cypress run for those two cases, and a solid habit: reset state, use `data-testid`, assert what the user sees.

## What is Cypress?

**End-to-end (E2E) testing** checks a full user journey in a real browser — from opening a page to clicking, typing, and asserting the result — as if a person were using the app.

**Cypress** is an E2E test runner that drives a real browser against your app. You write commands like `cy.visit`, `cy.get`, and `.should(...)`. Cypress **queues** those commands and retries assertions until they pass or time out — you do not write `await` on each step the way you would with raw Promises.

## What You'll Learn

- Project layout: read-only `public/`, `server.js`, `cypress/e2e/`, Docker Compose
- Start the app locally and point Cypress at `baseUrl`
- Core commands: `cy.visit`, `cy.get`, `.should`, `.type`, `.click`, `.clear`
- Prefer `[data-testid="…"]` over brittle CSS classes
- Reset fixtures with `cy.request('DELETE', '/api/v1/__reset')` in `beforeEach`

## Why This Matters

Module G Part A is testing-only under time pressure. If tooling, selectors, and reset habits are shaky, later specs (reserve, intercepts) fall apart. This module builds that foundation on the real competition template.

## PRD Connection

Implements **§5.1 Tooling & hygiene**, **§5.2 A1** (partial: page load + missing email), and **§5.4 Testing practices**.

## Prerequisites

- Node.js 20+ (template targets Node 22)
- Basic HTML/JS literacy
- Docker Desktop optional (Compose path mirrors assessment)

## Time Estimate

⏱️ **2–3 hours**

## Module Structure

1. Orient on Module G Part A rules and seed accounts
2. Start the SwapLoop app and open login
3. Install/run Cypress (local or Docker)
4. Implement `loads the login page`
5. Implement `shows an error when email is missing`
6. Selector hygiene mini-lab
7. Version control with Git

## Expected Result

- App serves `/login.html`
- `01_login.cy.js` has two green tests; remaining three `it`s stay as TODOs for Module 2
- You can explain why `__reset` belongs in `beforeEach`
