# Module 6: QR Scan, Intercepts & Full-Suite Rehearsal (A7–A8)

## Overview

Finish **Module G Part A** by implementing `07_qr_scan.cy.js` and `08_http_errors.cy.js`, then run the **entire** Cypress suite green. You will drive the QR emulator, force HTTP failures with `cy.intercept`, prove the reserve control cannot double-submit, and rehearse under competition-style time pressure.

## What is network isolation with `cy.intercept`?

Happy-path specs talk to the real mock API. Edge cases need **isolation**: you register a route handler **before** the UI action, then stub or delay the response.

| Pattern | Use |
|---------|-----|
| Stub `{ statusCode: 500, body: { message } }` | Force a server error the UI must surface cleanly |
| `req.on('response', (res) => res.setDelay(ms))` | Keep the real response, but slow it so you can assert in-flight UI |
| Alias + `cy.wait('@…')` | Synchronize on the network — not on `cy.wait(2000)` |

## What You'll Learn

- Assert the QR emulator surface on `scan.html`
- Valid station poster payload → station hub navigation
- Reject mismatched payloads with a clear message (no false station)
- Clear session → protected route redirects to login
- Force `500` on `POST /api/v1/services` with an actionable UI error (no stack traces)
- Delay reserve responses to assert **no double-submit**
- Run the full Part A suite and self-mark against Module G A1–A8

## Why This Matters

Competition Part A ends with QR + intercepts. Assessors care that you isolate errors, keep messages rider-friendly, and never invent stack traces or second successful reserves while a request is pending.

## PRD Connection

Implements **§5.2 A7–A8** and **§8 Success criteria**.

## Prerequisites

- Modules 1–5 complete (full login through activity journeys)
- Comfortable with `data-testid`, `__reset`, and `signInAsLin()`
- App startable via `node server.js` (Docker Compose optional)

## Time Estimate

⏱️ **2–3 hours** (+ optional 60–90 min timed rehearsal)

## Module Structure

1. QR emulator present on Scan
2. Valid poster payload → station hub
3. Mismatched payload rejected
4. Protected route → login after clearing session
5. Intercept `500` on reserve
6. Delayed reserve → no double-submit
7. Full-suite run + Module G checklist
8. Optional timed rehearsal
9. Git feature-branch workflow

## Expected Result

- Fully green `07_qr_scan.cy.js` and `08_http_errors.cy.js`
- Entire `cypress/e2e/**/*.cy.js` suite green
- Checklist maps every green `it` to Module G Part A (A1–A8)
