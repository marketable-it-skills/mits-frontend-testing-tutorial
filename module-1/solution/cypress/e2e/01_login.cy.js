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
    // The demo page pre-fills a seed email — clear it to trigger client validation
    cy.get('[data-testid="login-email"]').clear()
    cy.get('[data-testid="login-password"]').type('password123')
    cy.get('[data-testid="login-submit"]').click()

    cy.get('[data-testid="login-error"]')
      .should('be.visible')
      .and('contain', 'Email is required')

    // Rider must stay on the login screen
    cy.url().should('include', '/login.html')
    cy.get('[data-testid="login-page"]').should('be.visible')
  })

  it.skip('shows an error for invalid credentials', () => {
    // Module 2
  })

  it.skip('blocks suspended accounts', () => {
    // Module 2
  })

  it.skip('signs in and reaches stations', () => {
    // Module 2
  })
})
