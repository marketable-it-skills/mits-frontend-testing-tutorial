# Module 5: Activity Journeys — Swap & Charging

## Overview

Implement Module G **A5** (`05_activity_swap.cy.js`) and **A6** (`06_activity_charging.cy.js`). You will arrange login + reserve preconditions, drive a swap hold through reserved → started → confirmed (and cancel), then run an **integrated** rider through charging → live status → collect, asserting **API-backed** receipt fields.

## What is an activity lifecycle?

Activity is a small **state machine** driven by the mock API:

| Type | Happy path |
|------|------------|
| **SWAP** (Lin) | `RESERVED` → `STARTED` → `CONFIRMED` (+ receipt) |
| **CHARGING** (Chen) | `RESERVED` → `CHARGING` → `READY_FOR_COLLECTION` → `COLLECTED` (+ receipt) |

The SPA does **not** invent prices — `confirm` / `collect` responses carry `priceYuan` and `priceCode`. Prefer asserting UI against those payloads (e.g. via `cy.intercept` + `cy.wait('@alias')`) instead of hard-coding amounts.

## What You'll Learn

- Arrange helpers: `signInAsLin` / `signInAsChen` + reserve → Activity
- Reserved UI: countdown + Start / Cancel
- Swap start → confirm → receipt from API
- Cancel clears the active service (`activity-empty`)
- Charging live panel (`charging-live`) until ready-for-collection
- Waiting on **UI/API state** (and intercept aliases) — not arbitrary `cy.wait(ms)`

## Why This Matters

Competition Part A spends most of its time on service journeys. Solid arrange helpers and receipt assertions here make Module 6 (QR + intercepts) much faster.

## PRD Connection

Implements **§5.2 A5–A6** and uses seed riders from **§5.3**.

## Prerequisites

- Modules 1–4 complete (auth, register, stations, reserve)
- Comfortable with `data-testid` and `__reset`

## Time Estimate

⏱️ **3–4 hours**

## Module Structure

1. Swap reserved UI (countdown + actions)  
2. Swap start → confirm → receipt  
3. Cancel reserved swap  
4. Charging start (Chen / `station-003`)  
5. Live charging until ready  
6. Collect → receipt  
7. Git feature-branch workflow  

## Expected Result

Fully green `05_activity_swap.cy.js` (3 tests) and `06_activity_charging.cy.js` (3 tests).
