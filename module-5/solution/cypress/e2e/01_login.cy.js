/**
 * File-local helper for later specs (Module 3+).
 * Keep UI login for now — cy.session can come later once the suite is solid.
 */
function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('01 · Login', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
    cy.visit('/login.html')
  })

  it('loads the login page', () => {
    cy.get('[data-testid="login-page"]').should('be.visible')
    cy.get('[data-testid="login-title"]').should('contain', 'Sign in')
    cy.get('[data-testid="login-email"]').should('be.visible')
    cy.get('[data-testid="login-password"]').should('be.visible')
    cy.get('[data-testid="login-submit"]').should('be.visible')
  })

  it('shows an error when email is missing', () => {
    // Demo page pre-fills a seed email — clear it to trigger client validation
    cy.get('[data-testid="login-email"]').clear()
    cy.get('[data-testid="login-password"]').type('password123')
    cy.get('[data-testid="login-submit"]').click()

    cy.get('[data-testid="login-error"]')
      .should('be.visible')
      .and('contain', 'Email is required')

    cy.url().should('include', '/login.html')
    cy.get('[data-testid="login-page"]').should('be.visible')
  })

  it('shows an error for invalid credentials', () => {
    cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
    cy.get('[data-testid="login-password"]').clear().type('wrong-password')
    cy.get('[data-testid="login-submit"]').click()

    cy.get('[data-testid="login-error"]')
      .should('be.visible')
      .and('contain', 'Invalid email or password')

    cy.url().should('include', '/login.html')
  })

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
})
