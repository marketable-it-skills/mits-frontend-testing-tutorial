# Module 1 Workshop: First Cypress Login Tests

## Goal

Run the SwapLoop template and implement the first two Module G Part A login tests with stable selectors and a clean `beforeEach` reset.

> **Start from:** Your practice repo created from [mits-frontend-testing-tutorial-template](https://github.com/marketable-it-skills/mits-frontend-testing-tutorial-template) → **Use this template** → clone your new repo (see [Getting Started](../README.md#-getting-started)). Use this module’s `solution/` as a reference after you finish.

**Rules (from Module G):**

- Do **not** edit `public/` or `server.js`
- Prefer `data-testid` selectors
- Fill in test bodies only under `cypress/e2e/`

---

## Task 1: Orient on Module G Part A

### Step 1.1: Skim the competition outline

Open [Skills IT Training Camp 2026 Module G description](https://skillsit.eu/web-technologies/sitc2026-s17-module-g/project-description) and read **Part A — Frontend testing (Cypress)** through **A1 · Login**.

Note the seed accounts:

| Email                      | Password      | Notes             |
| -------------------------- | ------------- | ----------------- |
| `lin.xiaoyu@swaploop.test` | `password123` | Active swappable  |
| `chen.wei@swaploop.test`   | `password123` | Active integrated |
| `sun.hao@swaploop.test`    | `password123` | Suspended         |

### Step 1.2: Map this module’s scope

In Module 1 you only implement:

1. `loads the login page`
2. `shows an error when email is missing`

Leave the other three login `it`s as `TODO` for Module 2.

> **Verify:** You can explain Part A is Cypress-only; Part B (PHPUnit) is out of scope for this course.

---

## Task 2: Explore the template layout

### Step 2.1: Open the project

From your practice repo (created from the template):

```text
cypress-frontend-testing-template/
├── public/                 ← app UI (READ-ONLY)
├── server.js               ← mock API + static server (READ-ONLY)
├── cypress/e2e/*.cy.js     ← YOUR work
├── cypress.config.js
├── docker-compose.yml
└── Dockerfile
```

### Step 2.2: Peek at login selectors

Open `public/login.html` and find attributes like `data-testid="login-email"`. These are the selectors your tests should use.

> **Verify:** You can list at least `login-page`, `login-email`, `login-password`, `login-submit`, `login-error`.

---

## Task 3: Start the application

### Step 3.1: Run the Node server

```bash
cd path/to/your-practice-repo
node server.js
```

If port 3000 is busy:

```bash
# PowerShell
$env:PORT=3080; node server.js
```

### Step 3.2: Open the login page

Visit `http://127.0.0.1:3000/login.html` (or your `PORT`).

> **Verify:** You see **Sign in**, email, password, and **Sign in** button. Email may already be pre-filled with a seed value — that matters for the missing-email test later.

### Step 3.3 (Optional): Docker web service

```bash
docker compose up web --build
```

App is then on `http://127.0.0.1` (Compose maps `80:3000`).

---

## Task 4: Point Cypress at the app

### Step 4.1: Add a local Cypress toolchain (recommended for learning)

The assessment image is Cypress 15.10.0. For local runs, create `package.json` if missing:

```json
{
  "name": "swaploop-cypress-module-1",
  "private": true,
  "scripts": {
    "start": "node server.js",
    "cy:open": "cypress open --e2e",
    "cy:run": "cypress run --spec cypress/e2e/01_login.cy.js"
  },
  "devDependencies": {
    "cypress": "15.10.0"
  }
}
```

```bash
npm install
```

### Step 4.2: Set `baseUrl` for local Node

Edit `cypress.config.js`:

```js
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Local default. Docker Compose overrides via CYPRESS_baseUrl=http://web:3000
    baseUrl: "http://127.0.0.1:3000",
    supportFile: false,
    video: false,
    specPattern: "cypress/e2e/**/*.cy.js",
  },
});
```

> **Note:** If you started the server on `3080`, set `baseUrl` to `http://127.0.0.1:3080` instead.

### Step 4.3: Open the Cypress runner

Keep `node server.js` running in one terminal. In another:

```bash
npm run cy:open
```

Select **E2E Testing** → your browser → open `01_login.cy.js`.

> **Verify:** Spec loads. Existing empty `it`s may pass vacuously (no assertions yet) or show as pending depending on runner view — after Step 5 you will see real green assertions.

---

## Task 5: Understand `beforeEach` reset

### Step 5.1: Read the skeleton

`cypress/e2e/01_login.cy.js` already contains:

```js
beforeEach(() => {
  cy.request("DELETE", "/api/v1/__reset");
  cy.visit("/login.html");
});
```

`DELETE /api/v1/__reset` restores seed riders/stations so tests do not depend on leftover logins or prior registers.

> **Verify:** With the server up, open DevTools Network (or run from Cypress) and confirm `__reset` returns success when a test starts.

---

## Task 6: Implement `loads the login page`

### Step 6.1: Write assertions with `data-testid`

Replace the first `it` body:

```js
it("loads the login page", () => {
  cy.get('[data-testid="login-page"]').should("be.visible");
  cy.get('[data-testid="login-title"]').should("contain", "Sign in");
  cy.get('[data-testid="login-email"]').should("be.visible");
  cy.get('[data-testid="login-password"]').should("be.visible");
  cy.get('[data-testid="login-submit"]').should("be.visible");
});
```

### Step 6.2: Run the single test

In the Cypress UI, run `01_login.cy.js`, or from the CLI (server still running):

```bash
npm run cy:run
```

> **Verify:** `loads the login page` is green.

---

## Task 7: Implement `shows an error when email is missing`

### Step 7.1: Clear the pre-filled email

The login page ships with a demo email in the input. If you submit without clearing it, you will **not** hit the “Email is required” client check in `public/js/login.js`.

```js
it("shows an error when email is missing", () => {
  cy.get('[data-testid="login-email"]').clear();
  cy.get('[data-testid="login-password"]').type("password123");
  cy.get('[data-testid="login-submit"]').click();

  cy.get('[data-testid="login-error"]')
    .should("be.visible")
    .and("contain", "Email is required");

  cy.url().should("include", "/login.html");
  cy.get('[data-testid="login-page"]').should("be.visible");
});
```

### Step 7.2: Confirm you stay on login

The Module G expectation: validation message appears and the rider does not enter the app.

> **Verify:** Second test is green. URL still includes `login.html`.

---

## Task 8: Selector hygiene mini-lab

### Step 8.1: Break it on purpose

Temporarily change one selector to a wrong testid, e.g. `login-emailz`, and re-run.

> **Verify:** Cypress fails with a clear timeout / not found — that is expected.

### Step 8.2: Fix it

Restore the correct `[data-testid="login-email"]`.

> **Verify:** Suite is green again. Prefer testids over `.primary` / layout classes.

---

## Task 9: Leave Module 2 work marked

### Step 9.1: Keep TODOs for the remaining login cases

Ensure these still say TODO (do not implement yet):

- `shows an error for invalid credentials`
- `blocks suspended accounts`
- `signs in and reaches stations`

> **Verify:** Only the first two login tests contain real assertions.

---

## Task 10: Version Control with Git

### Step 10.1: Initialize Git (if this folder is not already a repo)

```bash
git init
```

### Step 10.2: Create a feature branch

```bash
git checkout -b feat/module-1-workshop
```

### Step 10.3: Stage and commit

```bash
git add .
git commit -m "Complete Module 1: Cypress setup and first two login tests"
```

### Step 10.4: Merge to main

```bash
git checkout main
git merge feat/module-1-workshop
```

### Step 10.5: Create GitHub repository and push (optional)

1. Create a new public repo on GitHub (no README)
2. Connect and push:

```bash
git remote add origin https://github.com/YOUR-USERNAME/swaploop-cypress-course.git
git branch -M main
git push -u origin main
```

> **Verify:** Remote shows your Module 1 Cypress changes — still no edits under `public/` or `server.js`.

---

## Done

You can run the app, reset state, and assert login UI with `data-testid`. Module 2 finishes the rest of `01_login.cy.js` (invalid credentials, suspended rider, successful sign-in) and introduces a small sign-in helper for later specs.

### Optional: Docker full stack (assessment style)

```bash
docker compose up web --build
docker compose up --abort-on-container-exit --exit-code-from cypress
```

Compose sets `CYPRESS_baseUrl=http://web:3000`, which overrides the local `baseUrl` in config.
