# Module 3 Workshop: Two-Step Registration (A2)

## Goal

Start from your **Module 2** solution and implement all three cases in `cypress/e2e/02_register.cy.js`.

> **Start from:** Module 2 `solution/`.

**Rules:** Do not edit `public/` or `server.js`. Prefer `data-testid`. Keep `DELETE /api/v1/__reset` in `beforeEach`.

---

## Task 1: Explore the register UI

### Step 1.1: Open the page

With the server running (`node server.js`), visit `/register.html`.

### Step 1.2: Inventory key testids

| Step | Testids |
|------|---------|
| Page | `register-page`, `register-title`, `register-steps` |
| Step 1 | `register-step1`, `register-email`, `register-password`, `register-display-name` |
| Mode | `register-mode-swappable`, `register-mode-integrated` |
| Vehicle | `register-battery-type`, `register-connector-type`, `register-swappable-fields`, `register-integrated-fields` |
| Actions | `register-next`, `register-error` |
| Step 2 | `register-step2`, `alipay-status`, `register-create` |

### Step 1.3: Sketch the flow

```text
Vehicle profile → Continue to Alipay → (wait) Alipay linked → Create account → stations.html
```

> **Verify:** Clicking **Continue** without email/password/name shows a required-fields error. Switching to **INTEGRATED** shows connector fields and hides battery type.

---

## Task 2: Negative path — missing battery type (swappable)

### Step 2.1: Why `.invoke('val', '')`?

The battery `<select>` always has a default (`SL-48`). To simulate “no battery type”, clear the value in the test:

```js
cy.get('[data-testid="register-battery-type"]').invoke('val', '').trigger('change')
```

### Step 2.2: Implement the first `it`

Fill email / password / display name, clear battery type, click **Continue**, then assert:

- `register-error` contains `batteryType is required for SWAPPABLE`
- Still on step 1 (`register-step1` visible, `register-step2` not visible)
- URL still includes `/register.html`

> **Verify:** Re-run only this test in Cypress. Account must **not** be created (you never reach stations).

---

## Task 3: Happy path — swappable rider

### Step 3.1: Use a unique email

After `__reset`, seeds return. New riders need unused emails, e.g. `new.swappable@swaploop.test`.

### Step 3.2: Drive both steps

1. Fill basics + ensure **SWAPPABLE** + select `SL-48`  
2. Click `register-next`  
3. Assert `register-step2` visible  
4. Assert `alipay-status` contains `Alipay linked` (Cypress retries — no `cy.wait(2000)`)  
5. Assert `register-create` is enabled, then click it  
6. Assert `stations-page` and `user-chip` contain the display name  

> **Verify:** Test is green. Prefer asserting on “Alipay linked” over arbitrary millisecond waits.

---

## Task 4: Happy path — integrated rider

### Step 4.1: Switch mode first

```js
cy.get('[data-testid="register-mode-integrated"]').click()
cy.get('[data-testid="register-integrated-fields"]').should('be.visible')
cy.get('[data-testid="register-swappable-fields"]').should('not.be.visible')
cy.get('[data-testid="register-connector-type"]').select('GB-AC-48')
```

### Step 4.2: Complete Alipay + create

Same step-2 pattern as swappable, with email like `new.integrated@swaploop.test`.

> **Verify:** Lands on stations with the integrated display name in `user-chip`.

---

## Task 5: Run the Module 3 suite

```bash
npx cypress run --spec cypress/e2e/02_register.cy.js
```

Optional regression:

```bash
npx cypress run --spec "cypress/e2e/01_login.cy.js,cypress/e2e/02_register.cy.js"
```

> **Verify:** All three register tests pass; login suite still green.

---

## Task 6: Version Control with Git

```bash
git checkout -b feat/module-3-workshop
git add .
git commit -m "Complete Module 3: two-step registration specs for swappable and integrated"
git checkout main
git merge feat/module-3-workshop
git push origin main
```

---

## Done

Module G **A2** is covered. Module 4 moves to **stations list + station detail / reserve** (`03` + `04`).
