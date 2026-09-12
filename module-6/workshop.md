# Module 6 Workshop: QR Scan, Intercepts & Full Suite (A7–A8)

## Goal

Start from **Module 5** and implement all cases in `07_qr_scan.cy.js` and `08_http_errors.cy.js`, then prove the **full** Part A suite is green.

> **Start from:** Module 5 `solution/`.

**Rules:** Do not edit `public/` or `server.js`. Prefer `data-testid`. Reset with `DELETE /api/v1/__reset`. Register `cy.intercept` **before** the UI action that fires the request.

### Best-practice notes (verified)

- Stub errors with `cy.intercept(..., { statusCode: 500, body: { message } })`
- Delay a **real** response with `req.on('response', (res) => res.setDelay(ms))` — do not use bare `cy.wait(2000)` for sync
- Prefer `cy.wait('@alias')` and UI assertions over fixed sleeps

---

## Task 1: Orient on Scan + QR API

### Step 1.1: Remember auth

`scan.html` calls `requireAuth()` — unsigned visits bounce to login. Sign in (or reuse `signInAsLin`) before every Scan assertion.

### Step 1.2: Payload sources

| Source | Role |
|--------|------|
| `DELETE /api/v1/__reset` | Seeds `GET /api/qr/current` with `https://app.swaploop.test/stations/station-001` |
| `PUT /api/qr/current` `{ payload }` | Override the poster string the emulator reads |
| `[data-testid="qr-emit-btn"]` | Starts the `<swaploop-qr-emulator>` scan (~800 ms) |

> **Verify:** Open `/qr-code-emulator.html` in the browser once and confirm the default payload matches the reset seed.

---

## Task 2: Emulator is present (A7)

1. `__reset` → `signInAsLin()` → `cy.visit('/scan.html')`
2. Assert `scan-page`, `qr-emulator`, `qr-wc`, and `qr-emit-btn` are visible

> **Verify:** Case `embeds the QR emulator` green.

---

## Task 3: Valid poster → station hub (A7)

1. After reset + sign-in + Scan visit, alias `GET **/api/qr/current`
2. Click `qr-emit-btn`, `cy.wait('@qrCurrent')`
3. Assert `station-detail-page` (timeout ≥ 10s), URL includes `station.html` and `id=station-001`

> **Verify:** You landed on the hub for the seeded station — not a hard-coded wait for 800 ms alone.

---

## Task 4: Mismatched payload (A7)

1. `cy.request('PUT', '/api/qr/current', { payload: 'https://evil.example/not-a-station' })`
2. Sign in → Scan → click emit
3. Assert `scan-error` contains `QR payload does not match a SwapLoop station poster`
4. Stay on `/scan.html`; `station-detail-page` must not exist

> **Verify:** No false navigation to a station hub.

---

## Task 5: Protected route → login (A8)

1. Sign in as Lin
2. Clear the session token:

```js
cy.window().then((win) => {
  win.localStorage.removeItem('swaploop_token')
})
```

3. `cy.visit('/activity.html')`
4. Assert URL includes `/login.html` and `login-page` is visible

> **Verify:** Clearing storage is enough — you did not edit app source.

---

## Task 6: Force 500 on reserve (A8)

Register the intercept **first**:

```js
cy.intercept('POST', '**/api/v1/services', {
  statusCode: 500,
  body: { message: 'Something went wrong. Please try again.' },
}).as('reserveFail')
```

1. Sign in → open `/station.html?id=station-001`
2. Click `reserve-btn` → `cy.wait('@reserveFail')`
3. Assert `station-error` shows the actionable message
4. Assert it does **not** contain stack-like fragments (`at `, raw `Internal error`)
5. Stay on station hub — Activity must not open

> **Verify:** Rider sees a clear message, not a stack dump.

---

## Task 7: No double-submit (A8)

Delay the **real** reserve response:

```js
cy.intercept('POST', '**/api/v1/services', (req) => {
  req.on('response', (res) => {
    res.setDelay(2000)
  })
}).as('reserve')
```

1. Sign in → station-001 → click `reserve-btn`
2. While pending: `reserve-btn` should be `disabled`
3. Force a second click: `.click({ force: true })`
4. `cy.wait('@reserve')` then `cy.get('@reserve.all').should('have.length', 1)`
5. Assert Activity opens once

> **Verify:** Exactly one `POST /services` — the UI’s `reserveInFlight` guard held.

---

## Task 8: Full-suite green

With the server running:

```bash
npm run cy:run:all
# or
npx cypress run
```

Optional Compose (assessment style): use the template/`docker-compose.yml` and exit on the Cypress service.

> **Verify:** Specs `01`–`08` all pass.

---

## Task 9: Self-mark against Module G

Open [`../../proejct-task/module-g.md`](../../proejct-task/module-g.md) Part A. For each A1–A8 row, tick the matching green `it` title.

| Block | Spec file | Done when |
|-------|-----------|-----------|
| A1 | `01_login.cy.js` | 5/5 green |
| A2 | `02_register.cy.js` | 3/3 green |
| A3–A4 | `03` + `04` | all green |
| A5–A6 | `05` + `06` | all green |
| A7 | `07_qr_scan.cy.js` | 3/3 green |
| A8 | `08_http_errors.cy.js` | 3/3 green |

> **Verify:** Every Module G Part A expectation has a green counterpart.

---

## Task 10 (optional): Timed rehearsal

60–90 minutes:

1. Branch from a clean copy of empty skeletons **or** temporarily blank the Module 6 `it` bodies
2. Re-implement A7–A8 under the clock (or introduce intentional breakages and fix them)
3. Finish with `npm run cy:run:all`

> **Tip:** Competition Part A budget is ~1.5–2 h for the whole Cypress block — this drill is only the capstone slice.

---

## Task 11: Version Control with Git

```bash
git checkout -b feat/module-6-workshop
git add .
git commit -m "Complete Module 6: QR scan, HTTP intercepts, and full Part A suite"
git checkout main
git merge feat/module-6-workshop
git push origin main
```

---

## Done

Module G **Part A (Cypress)** is complete. Part B (PHPUnit) is a separate deliverable — out of scope for this course.
