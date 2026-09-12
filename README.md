# MITS Frontend Testing Tutorial

> From first `cy.visit` to a green Module G Cypress suite — competition-ready frontend testing.

[![Modules](./assets/images/badge-modules.svg)](.)
[![Difficulty](./assets/images/badge-difficulty.svg)](.)
[![Duration](./assets/images/badge-duration.svg)](.)
[![Cypress](./assets/images/badge-cypress.svg)](.)
[![Status](./assets/images/badge-status.svg)](.)

**Powered by [Marketable IT Skills (MITS)](https://github.com/marketable-it-skills) initiative**

---

## 📚 Overview

This course teaches **Cypress end-to-end testing** by implementing the full rider-UI suite from the Skill IT Training Camp 2026 competition outline **[Module G – SwapLoop Automated Testing](https://skillsit.eu/web-technologies/sitc2026-s17-module-g/project-description)** (**Part A — Frontend testing with Cypress**). You work against the provided **SwapLoop** multi-page app and do **not** change application source — you fill Cypress `it` bodies under `cypress/e2e/` until all Part A expectations pass.

The approach is **practice-first and competition-aligned**: every workshop maps to real Module G `it` titles. You get a green assertion in Module 1, then layer auth edge cases, multi-step registration, stations/reserve, activity journeys, QR scan, and HTTP intercepts.

### What You'll Build

A complete, deterministic Cypress suite for Module G Part A (specs A1–A8):

| Spec                 | File                         | Coverage                                                                          |
| -------------------- | ---------------------------- | --------------------------------------------------------------------------------- |
| A1 Login             | `01_login.cy.js`             | Page load, validation, invalid credentials, suspended account, successful sign-in |
| A2 Register          | `02_register.cy.js`          | Vehicle profile validation; swappable + integrated register                       |
| A3 Stations          | `03_stations.cy.js`          | List, filters, compatibility badges, public browse                                |
| A4 Station detail    | `04_station_detail.cy.js`    | Open hub, reserve, 409 conflict, block second hold                                |
| A5 Activity swap     | `05_activity_swap.cy.js`     | Reserved UI → start → confirm → receipt; cancel                                   |
| A6 Activity charging | `06_activity_charging.cy.js` | Start charge → live status → collect → receipt                                    |
| A7 QR scan           | `07_qr_scan.cy.js`           | Emulator, valid poster, mismatched payload                                        |
| A8 HTTP errors       | `08_http_errors.cy.js`       | Protected route redirect, intercept 500, double-submit guard                      |

### Who This Course Is For

- MITS / WorldSkills Web Technologies competitors preparing for Module G–style testing
- Intermediate front-end learners who know HTML/JS but are new (or rusty) with Cypress
- Instructors running SwapLoop / Skill17-style Cypress workshops

> **Out of scope:** Module G Part B (PHPUnit / partner billing). This course ends when the Cypress suite is complete.

---

## 🎯 What You'll Learn

By completing this course, you'll be able to:

- ✅ Run the SwapLoop template locally (Node and/or Docker Compose) with Cypress
- ✅ Use `data-testid` selectors and reset domain state with `DELETE /api/v1/__reset`
- ✅ Implement all Module G Part A specs (`01`–`08`)
- ✅ Cover auth, register, stations, reserve, swap, charging, QR, and HTTP error cases
- ✅ Use `cy.intercept` for forced failures and pending-request guards
- ✅ Complete a timed green-suite rehearsal suitable for competition Part A

---

## 📋 Prerequisites

**Required:**

- Node.js 20+ (template targets Node 22)
- Basic HTML and JavaScript literacy
- A code editor (VS Code recommended)

**Recommended:**

- Prior exposure to browser DevTools / network tab
- Docker Desktop (Compose path mirrors the assessment layout)
- A GitHub account for the Git workflow tasks

**Tools:**

- Cypress 15.x (`cypress/included:15.10.0` in Docker)
- Node.js mock API (`server.js`) serving the rider UI
- Optional: Docker Compose (`web` + `cypress` services)

**No prior Cypress experience needed** — Module 1 starts from first principles.

---

## 📖 Course Structure

### Module 1: Environment, Cypress Mental Model & First Login Assertions

⏱️ **Time:** 2–3 hours

Get the template running and write the first meaningful Cypress tests against login — visit, query, type, assert, and reset state.

**What you'll learn:**

- Project layout: read-only `public/`, `server.js`, `cypress/e2e/`, Docker Compose
- Cypress command queue vs synchronous JS intuition
- `cy.visit`, `cy.get`, `.should`, `.type`, `.click`
- Preferring `[data-testid="…"]` and `__reset` in `beforeEach`

**Deliverable:** Two green login tests in `01_login.cy.js`.

---

### Module 2: Complete Login Suite (A1) + Sign-in Helper

⏱️ **Time:** 2–3 hours

Finish A1 — invalid credentials, suspended accounts, successful sign-in — and extract a small `signInAsLin()` helper for later specs.

**What you'll learn:**

- Client validation vs API error messages
- Asserting `stations-page` landing and `user-chip` identity
- File-local helper pattern without over-abstracting

**Deliverable:** Fully green `01_login.cy.js` plus reusable sign-in helper.

---

### Module 3: Registration Flows (A2)

⏱️ **Time:** 2–3 hours

Drive SwapLoop’s two-step registration (vehicle profile → mock Alipay) for swappable and integrated riders.

**What you'll learn:**

- Multi-step form sequencing in Cypress
- Mode-specific required fields (battery vs connector type)
- Negative path: incomplete profile must not create an account

**Deliverable:** Fully green `02_register.cy.js`.

---

### Module 4: Stations List + Station Detail & Reserve (A3–A4)

⏱️ **Time:** 3–4 hours

Cover browsing/filtering and the reserve conflict matrix, including forced 409 messaging.

**What you'll learn:**

- Authenticated list + type filters + public browse
- Navigation from card → station hub
- Happy-path reserve → Activity; `__force-conflict`; block second hold

**Deliverable:** Green `03_stations.cy.js` and `04_station_detail.cy.js`.

---

### Module 5: Activity Journeys — Swap & Charging (A5–A6)

⏱️ **Time:** 3–4 hours

Drive full service lifecycles and assert **API-backed** receipts (never invented amounts).

**What you'll learn:**

- Arrange preconditions (login + reserve) before Activity assertions
- Swap path: reserved → start → confirm → receipt; cancel path
- Charging path with integrated rider (`chen.wei@…`): live status → collect → receipt

**Deliverable:** Green `05_activity_swap.cy.js` and `06_activity_charging.cy.js`.

---

### Module 6: QR Scan, Intercepts & Full-Suite Rehearsal (A7–A8)

⏱️ **Time:** 2–3 hours (+ optional timed drill)

Finish edge cases and prove the entire Cypress suite green under time pressure.

**What you'll learn:**

- QR emulator on `scan.html`; valid vs mismatched poster payloads
- Protected-route redirect; `cy.intercept` for 500s and double-submit guards
- Competition hygiene and full-suite rehearsal

**Deliverable:** Entire Part A suite green; checklist maps every `it` to Module G Part A.

---

## 🚀 Getting Started

1. Create your practice repo from the GitHub template: [mits-frontend-testing-tutorial-template](https://github.com/marketable-it-skills/mits-frontend-testing-tutorial-template) → **Use this template** → clone your new repo
2. Read [Module 1 overview](./module-1/overview.md)
3. Work through [Module 1 workshop](./module-1/workshop.md) in your practice repo
4. Compare against [`module-1/solution/`](./module-1/solution/)
5. Continue through Modules 2–6

> A local copy also lives in this course as [`cypress-frontend-testing-template/`](./cypress-frontend-testing-template/) if you prefer not to use GitHub.

In your practice repo (from the template):

```bash
npm install
npm start
# if port 3000 is busy: PORT=3080 npm start
# In another terminal:
npm run cypress:open   # interactive
# or: npm test         # headless
```

Docker Compose (assessment-style layout) is documented in the [template README](https://github.com/marketable-it-skills/mits-frontend-testing-tutorial-template#readme).

### Seed accounts (tests only)

| Email                      | Password      | Role                                           |
| -------------------------- | ------------- | ---------------------------------------------- |
| `lin.xiaoyu@swaploop.test` | `password123` | Swappable rider (`SL-48`) — default happy path |
| `chen.wei@swaploop.test`   | `password123` | Integrated rider — charging flows              |
| `sun.hao@swaploop.test`    | `password123` | Suspended — distinct 403 login failure         |

### Competition outline

See [`proejct-task/module-g.md`](https://skillsit.eu/web-technologies/sitc2026-s17-module-g/project-description) — **Part A — Frontend testing (Cypress)** only.

---

## 📚 Modules

| Module         | Title                                      | Time | Topics                                    |
| -------------- | ------------------------------------------ | ---- | ----------------------------------------- |
| [1](module-1/) | Environment + Cypress Basics + First Login | 2–3h | visit/get/type/assert, `__reset`, testids |
| [2](module-2/) | Complete Login Suite + Sign-in Helper      | 2–3h | A1 complete, validation vs API errors     |
| [3](module-3/) | Registration Flows (A2)                    | 2–3h | Multi-step forms, rider modes             |
| [4](module-4/) | Stations + Detail & Reserve (A3–A4)        | 3–4h | Filters, reserve, 409 conflict            |
| [5](module-5/) | Activity — Swap & Charging (A5–A6)         | 3–4h | State machines, API-true receipts         |
| [6](module-6/) | QR Scan + Intercepts + Full Suite (A7–A8)  | 2–3h | Emulator, `cy.intercept`, rehearsal       |

---

## 🛠️ Technologies & Concepts

### Core Technologies

- **Cypress 15.x** — E2E test runner (local or `cypress/included` image)
- **Node.js 22 + `server.js`** — static rider UI + Module C–compatible mock API
- **Docker Compose** — optional `web` + `cypress` services (ws26-cypress layout)
- **Vanilla multi-page HTML/JS** — application under test (read-only)

### Key Concepts

- Cypress command queue and assertion retry
- Stable selectors via `data-testid`
- Test isolation with `__reset` / `__force-conflict`
- `cy.intercept` for error and timing isolation
- Arrange / act / assert readability under competition time pressure

### Professional Practices

- Read-only app rule (do not edit `public/` or `server.js`)
- Git feature-branch workflow per module
- Prefer UI/API state waits over arbitrary `cy.wait(ms)`
- Assert receipt amounts from API responses — never invent values

---

## 📁 Project Structure

```
courses/mits-frontend-testing-tutorial/
├── cypress-frontend-testing-template/   # App under test + Cypress skeletons
│   ├── public/                          # Rider UI (read-only for students)
│   ├── cypress/e2e/                     # Spec skeletons (01–08)
│   ├── server.js                        # Static + mock API
│   ├── cypress.config.js
│   └── docker-compose.yml
├── proejct-task/
│   └── module-g.md                      # Competition outline (Part A focus)
├── module-1/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── module-2/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── module-3/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── module-4/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── module-5/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── module-6/
│   ├── overview.md
│   ├── workshop.md
│   └── solution/
├── metadata.json
└── README.md                            # This file
```

---

## 🤝 Contributing

This tutorial is part of the MITS Pilot program. If you find issues or have suggestions:

1. Open an issue describing the problem or suggestion
2. For fixes, submit a pull request with a clear description

## 📝 License

This project is part of the Marketable IT Skills initiative.

## 🔗 Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Skill17 ws26-cypress](https://github.com/Skill17-WebTechnologies/ws26-cypress)
- [Module G outline](./proejct-task/module-g.md)

## 💬 Support

For questions or support, please open an issue in this repository.

---

**Part of the [Marketable IT Skills (MITS)](https://github.com/marketable-it-skills) initiative**
