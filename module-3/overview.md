# Module 3: Registration Flows (A2)

## Overview

Implement **Module G A2** by filling `02_register.cy.js`. You will drive SwapLoop’s **two-step registration**: vehicle profile (step 1) → mock Alipay link (step 2) → create account → stations. Cover the swappable validation failure and happy paths for both **SWAPPABLE** and **INTEGRATED** riders.

## What is a multi-step form in Cypress?

A multi-step UI hides and shows sections over time. Tests must:

1. Fill only what the **current** step exposes  
2. Assert the next step is visible before interacting with it  
3. Wait on **UI state** (e.g. “Alipay linked”, button enabled) instead of fixed `cy.wait(ms)`

## What You'll Learn

- Inventory and use register `data-testid`s for both steps
- Mode-specific fields: battery type (swappable) vs connector type (integrated)
- Negative path: missing battery type must not create an account
- Assert post-register authenticated landing on stations

## Why This Matters

Registration is the first multi-step Module G flow. The same “wait for the right step” habit applies later to reserve → activity journeys.

## PRD Connection

Implements **§5.2 A2**.

## Prerequisites

- Modules 1–2 complete (Cypress + full login suite)
- Comfortable with `cy.get`, `.type`, `.click`, `.should`

## Time Estimate

⏱️ **2–3 hours**

## Module Structure

1. Explore `register.html` and step indicators  
2. Negative: swappable without battery type  
3. Happy path: swappable rider (profile → Alipay → stations)  
4. Happy path: integrated rider  
5. Git feature-branch workflow  

## Expected Result

Fully green `02_register.cy.js` (all three `it`s). New accounts use unique emails so they do not clash with seed riders after `__reset`.
