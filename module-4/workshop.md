# Module 4 Workshop: Stations + Reserve (A3–A4)

## Goal

Start from **Module 3** and implement all cases in `03_stations.cy.js` and `04_station_detail.cy.js`.

> **Start from:** Module 3 `solution/`.

**Rules:** Do not edit `public/` or `server.js`. Prefer `data-testid`. Reset with `DELETE /api/v1/__reset`.

---

## Task 1: Helper + seed map

### Step 1.1: Keep `signInAsLin()`

Copy the helper into both new spec files (clear + type credentials).

### Step 1.2: Know the stations

| Id | Name (contains) | Type | Notes for Lin (SL-48) |
|----|-----------------|------|------------------------|
| `station-001` | Jing… | HYBRID | Eligible swap — good for happy reserve |
| `station-002` | Zhangjiang | SWAP | Eligible — good for second-station / conflict |
| `station-003` | Xuhui | CHARGING | Not eligible for swappable Lin |
| `station-005` | Last-charge… | SWAP | Always conflicts — optional; prefer `__force-conflict` |

Cards use `data-testid="station-card-station-001"` (etc.). The HTML template’s bare `station-card` is overwritten when cards render — count with `[data-testid^="station-card-"]`.

> **Verify:** After login, DevTools shows those card testids in the list.

---

## Task 2: `lists stations for a signed-in rider`

1. `signInAsLin()`  
2. Assert `station-list` visible  
3. Assert at least one card for `station-001` / `station-002` with **name** + **type** via nested testids  

> **Verify:** Spec green.

---

## Task 3: `filters by station type`

1. Sign in  
2. Click `[data-testid="filter-swap"]`  
3. URL includes `type=SWAP`  
4. Every `[data-testid="station-type"]` text is `SWAP`  

> **Verify:** CHARGING-only stations disappear from the list.

---

## Task 4: `shows compatible availability indication`

For Lin:

- `station-001` availability contains `SL-48` (ready pack message)  
- `station-003` contains `No ready battery for your profile`  
- Must **not** show the guest “Sign in…” hint  

> **Verify:** You are asserting API-driven badge copy, not inventing text.

---

## Task 5: `unauthenticated visitors can browse stations`

1. `cy.visit('/stations.html')` **without** login  
2. List has cards  
3. `nav-login` visible  
4. Availability shows `Sign in to see rider availability`  

> **Verify:** No redirect to login for the public list itself.

---

## Task 6: Open station detail from a card

```js
cy.get('[data-testid="station-card-station-001"]').click()
cy.get('[data-testid="station-detail-page"]').should('be.visible')
cy.url().should('include', 'id=station-001')
```

Assert name / type / status / availability / reserve button.

> **Verify:** Hub identity matches the card you clicked.

---

## Task 7: Reserve when eligible

On `station-001`, click enabled `reserve-btn` (“Reserve battery”).

Expect `/activity.html` and `[data-testid="activity-page"]`.

> **Verify:** Hold created — Activity loads.

---

## Task 8: Forced conflict (`__force-conflict`)

```js
cy.request('POST', '/api/v1/__force-conflict')
```

Then open an eligible station (e.g. `station-002`), click reserve.

Expect:

- `station-error` contains `not available anymore`  
- Still on `station.html` (no Activity success)  
- Availability / ready badge refreshed from API (`No ready battery…` / `NOT AVAILABLE`)  

> **Verify:** You did **not** hard-code a fake “still ready” badge after the 409.

---

## Task 9: Block second reserve

1. Reserve at `station-001` → Activity  
2. Open `station-002` and reserve again  
3. Error: `active service at another station`  
4. Click `nav-activity` → Activity still reachable  

> **Verify:** Second reserve fails; Activity nav works.

---

## Task 10: Run both specs

```bash
npx cypress run --spec "cypress/e2e/03_stations.cy.js,cypress/e2e/04_station_detail.cy.js"
```

> **Verify:** All 8 tests green.

---

## Task 11: Version Control with Git

```bash
git checkout -b feat/module-4-workshop
git add .
git commit -m "Complete Module 4: stations list, detail hub, and reserve conflict cases"
git checkout main
git merge feat/module-4-workshop
git push origin main
```

---

## Done

Module G **A3–A4** covered. Module 5 continues with Activity swap & charging journeys.
