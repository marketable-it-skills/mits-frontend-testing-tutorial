# Module 5 Workshop: Activity Swap & Charging (A5–A6)

## Goal

Start from **Module 4** and implement all cases in `05_activity_swap.cy.js` and `06_activity_charging.cy.js`.

> **Start from:** Module 4 `solution/`.

**Rules:** Do not edit `public/` or `server.js`. Prefer `data-testid`. Reset with `DELETE /api/v1/__reset`. Prefer UI/API assertions over `cy.wait(ms)`.

### Speeding up charging (optional)

Default charge duration is **15s** (`CHARGE_SECONDS`). For local runs you may start the server with a shorter window — still assert on status, do not sleep for a fixed ms:

```bash
# PowerShell
$env:CHARGE_SECONDS = "5"; node server.js
```

---

## Task 1: Helpers + seed map

### Step 1.1: Keep Lin; add Chen

| Rider | Email | Password | Mode | Use for |
|-------|-------|----------|------|---------|
| Lin | `lin.xiaoyu@swaploop.test` | `password123` | Swappable `SL-48` | A5 swap |
| Chen | `chen.wei@swaploop.test` | `password123` | Integrated `GB-AC-48` | A6 charging |

### Step 1.2: Stations that matter

| Id | Notes |
|----|--------|
| `station-001` | HYBRID — good Lin swap reserve |
| `station-003` | CHARGING — good Chen bay reserve |

### Step 1.3: Arrange helpers

```js
function reserveSwapAt(stationId) {
  cy.visit(`/station.html?id=${stationId}`)
  cy.get('[data-testid="reserve-btn"]').should('not.be.disabled').click()
  cy.get('[data-testid="activity-page"]').should('be.visible')
}
```

Mirror for Chen (`Reserve charging bay`).

> **Verify:** After reserve, `activity-active` is visible and `active-status` is `RESERVED`.

---

## Task 2: Reserved UI (swap)

1. `signInAsLin()` + `reserveSwapAt('station-001')`  
2. Assert `active-type` = `SWAP`, `active-status` = `RESERVED`  
3. `active-countdown` visible; `#countdown-secs` not `—`  
4. `action-start` shows **Start swapping**; `action-cancel` visible; confirm hidden  

> **Verify:** Spec case `shows countdown and actions while reserved` green.

---

## Task 3: Start → confirm → receipt

1. From reserved, click **Start swapping** → status `STARTED`, **Confirm swap** visible  
2. Register intercept **before** confirm:

```js
cy.intercept('POST', '**/api/v1/services/*/confirm').as('confirmSwap')
cy.get('[data-testid="action-confirm"]').click()
cy.wait('@confirmSwap').then(({ response }) => {
  const { priceYuan, priceCode } = response.body
  cy.get('[data-testid="receipt-amount"]').should(
    'contain',
    `CNY ${Number(priceYuan).toFixed(2)}`,
  )
  cy.get('[data-testid="receipt-code"]').should('contain', priceCode)
})
```

> **Verify:** Receipt matches the confirm payload — you did not invent `CNY` amounts.

---

## Task 4: Cancel reserved swap

1. Reserve again  
2. Click `action-cancel`  
3. `activity-empty` visible; `activity-active` not visible  

> **Verify:** No active service remains.

---

## Task 5: Start charging (Chen)

1. `signInAsChen()` + reserve at `station-003`  
2. Click **Start charging**  
3. Status `CHARGING`; `charging-live` visible; Start/Cancel hidden  

> **Verify:** Cancel is not offered after charging starts.

---

## Task 6: Live status until ready

1. After start, assert metrics (`#m-soc`, `#m-power`) are populated  
2. Wait on status (retry-ability), with a long enough timeout for `CHARGE_SECONDS`:

```js
cy.get('[data-testid="active-status"]', { timeout: 25000 }).should(
  'contain',
  'READY_FOR_COLLECTION',
)
cy.get('[data-testid="action-collect"]').should('be.visible')
```

> **Verify:** You did **not** use `cy.wait(15000)`.

---

## Task 7: Collect → receipt

Same pattern as swap confirm, but intercept `**/collect` and assert `COLLECTED` + receipt amount/code from the response.

> **Verify:** Collect case green.

---

## Task 8: Run both specs

With the server running:

```bash
npm run cy:run
```

Or:

```bash
npx cypress run --spec "cypress/e2e/05_activity_swap.cy.js,cypress/e2e/06_activity_charging.cy.js"
```

> **Verify:** All 6 tests green.

---

## Task 9: Version Control with Git

```bash
git checkout -b feat/module-5-workshop
git add .
git commit -m "Complete Module 5: activity swap and charging journeys with API receipts"
git checkout main
git merge feat/module-5-workshop
git push origin main
```

---

## Done

Module G **A5–A6** covered. Module 6 finishes Part A with QR scan, HTTP intercepts, and a full-suite rehearsal.
