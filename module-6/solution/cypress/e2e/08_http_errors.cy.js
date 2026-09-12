function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('08 · HTTP intercepts and errors', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('handles protected-route unauth by returning to login', () => {
    signInAsLin()

    cy.window().then((win) => {
      win.localStorage.removeItem('swaploop_token')
    })

    cy.visit('/activity.html')

    cy.url().should('include', '/login.html')
    cy.get('[data-testid="login-page"]').should('be.visible')
  })

  it('shows an actionable message on server error during reserve', () => {
    // Register intercept BEFORE the action that triggers POST /services
    cy.intercept('POST', '**/api/v1/services', {
      statusCode: 500,
      body: { message: 'Something went wrong. Please try again.' },
    }).as('reserveFail')

    signInAsLin()
    cy.visit('/station.html?id=station-001')

    cy.get('[data-testid="reserve-btn"]').should('not.be.disabled').click()
    cy.wait('@reserveFail')

    cy.get('[data-testid="station-error"]')
      .should('be.visible')
      .and('contain', 'Something went wrong. Please try again.')
      .and('not.contain', 'at ')
      .and('not.contain', 'Internal error')

    cy.url().should('include', '/station.html')
    cy.get('[data-testid="activity-page"]').should('not.exist')
  })

  it('prevents double-submit while reserve is pending', () => {
    cy.intercept('POST', '**/api/v1/services', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000)
      })
    }).as('reserve')

    signInAsLin()
    cy.visit('/station.html?id=station-001')

    cy.get('[data-testid="reserve-btn"]').should('not.be.disabled').click()

    // App sets reserveInFlight → button disabled; second click must not fire
    cy.get('[data-testid="reserve-btn"]').should('be.disabled')
    cy.get('[data-testid="reserve-btn"]').click({ force: true })

    cy.wait('@reserve')
    cy.get('@reserve.all').should('have.length', 1)

    cy.get('[data-testid="activity-page"]').should('be.visible')
    cy.url().should('include', '/activity.html')
  })
})
