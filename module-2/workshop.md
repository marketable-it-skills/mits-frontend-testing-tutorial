# Module 2 Workshop: Finish Login (A1) + Helper

## Goal

Start from your **Module 1** solution and complete `01_login.cy.js` so all Module G A1 expectations pass. Add a reusable `signInAsLin()` helper.

> **Start from:** Module 1 `solution/` (or continue in the same working copy).

**Rules:** Do not edit `public/` or `server.js`. Prefer `data-testid`.

---

## Task 1: Confirm Module 1 baseline

### Step 1.1: Start the app

```bash
cd path/to/your-working-copy
node server.js
```

### Step 1.2: Run the login spec

```bash
npm run cy:run
```

> **Verify:** The two Module 1 tests still pass. If you used `it.skip` on the remaining cases, unskip them as you implement each one.

---

## Task 2: Invalid credentials (API 401)

### Step 2.1: Know the expected message

The mock API returns **`Invalid email or password`** for wrong credentials (HTTP 401). That is different from the client-side `Email is required` message.

### Step 2.2: Implement the test

Remember the login page may pre-fill Lin’s email — always `.clear()` before typing.

```js
it('shows an error for invalid credentials', () => {
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('wrong-password')
  cy.get('[data-testid="login-submit"]').click()

  cy.get('[data-testid="login-error"]')
    .should('be.visible')
    .and('contain', 'Invalid email or password')

  cy.url().should('include', '/login.html')
})
```

### Step 2.3: Run

```bash
npm run cy:run
```

> **Verify:** This `it` is green. You still stay on `/login.html`.

---

## Task 3: Suspended account (API 403)

### Step 3.1: Use the suspended seed rider

| Email | Password | Expected |
| ----- | -------- | -------- |
| `sun.hao@swaploop.test` | `password123` | `Account suspended` |

### Step 3.2: Implement with a distinct-message assertion

```js
it('blocks suspended accounts', () => {
  cy.get('[data-testid="login-email"]').clear().type('sun.hao@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()

  cy.get('[data-testid="login-error"]')
    .should('be.visible')
    .and('contain', 'Account suspended')
    .and('not.contain', 'Invalid email or password')

  cy.url().should('include', '/login.html')
  cy.get('[data-testid="login-page"]').should('be.visible')
})
```

> **Verify:** Message is **not** the same as invalid credentials. Rider does not reach stations.

---

## Task 4: Successful sign-in → stations

### Step 4.1: Assert landing + identity

After a valid login as Lin, the app navigates to `stations.html`, shows `[data-testid="stations-page"]`, and reveals `[data-testid="user-chip"]` with **Lin Xiaoyu**.

```js
it('signs in and reaches stations', () => {
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()

  cy.url().should('include', '/stations.html')
  cy.get('[data-testid="stations-page"]').should('be.visible')
  cy.get('[data-testid="user-chip"]')
    .should('be.visible')
    .and('contain', 'Lin Xiaoyu')
})
```

### Step 4.2: Run the full login file

```bash
npm run cy:run
```

> **Verify:** All five login tests pass.

---

## Task 5: Extract `signInAsLin()` helper

### Step 5.1: Add a file-local helper above the `describe`

Do **not** over-abstract yet (no custom commands required). A plain function is enough for Modules 3–4 to copy:

```js
function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}
```

### Step 5.2: Optional smoke use

You may leave the successful-login `it` written inline (clearer for A1 marking) and keep the helper for later specs — as in the Module 2 solution. Or refactor the happy-path `it` to call the helper; either is fine if assertions still match Module G.

> **Verify:** Spec still fully green after adding the helper.

> **Note:** Official Cypress guidance often prefers `cy.session` for cached auth. For this course we keep **UI login** first (competition specs drive the real form). You can adopt `cy.session` later once Part A is solid.

---

## Task 6: Isolation mini-lab

### Step 6.1: Prove leftover session risk

1. Manually log in as Lin in the browser.
2. Temporarily comment out `cy.request('DELETE', '/api/v1/__reset')` in `beforeEach`.
3. Re-run tests and observe odd failures or unexpected “already in app” behaviour.
4. Restore `__reset`.

> **Verify:** With `__reset` back, the suite is green and independent again.

---

## Task 7: Version Control with Git

```bash
git checkout -b feat/module-2-workshop
git add .
git commit -m "Complete Module 2: full login suite and signInAsLin helper"
git checkout main
git merge feat/module-2-workshop
git push origin main
```

> **Tip:** Commit after each major task, not only at the end.

---

## Done

`01_login.cy.js` covers all of Module G **A1**. Module 3 moves to **A2 registration** (`02_register.cy.js`) — multi-step forms for swappable and integrated riders.
