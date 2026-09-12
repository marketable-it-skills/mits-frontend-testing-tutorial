function signInAsChen() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('chen.wei@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

/** Reserve a charging bay hold for Chen and land on Activity. */
function reserveChargingAt(stationId) {
  cy.visit(`/station.html?id=${stationId}`)
  cy.get('[data-testid="station-detail-page"]').should('be.visible')
  cy.get('[data-testid="reserve-btn"]')
    .should('not.be.disabled')
    .and('contain', 'Reserve charging bay')
    .click()
  cy.url().should('include', '/activity.html')
  cy.get('[data-testid="activity-page"]').should('be.visible')
  cy.get('[data-testid="activity-active"]').should('be.visible')
}

describe('06 · Activity — charging', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('starts charging from a reserved hold', () => {
    signInAsChen()
    reserveChargingAt('station-003')

    cy.get('[data-testid="active-type"]').should('contain', 'CHARGING')
    cy.get('[data-testid="active-status"]').should('contain', 'RESERVED')
    cy.get('[data-testid="action-start"]')
      .should('be.visible')
      .and('contain', 'Start charging')
      .click()

    cy.get('[data-testid="active-status"]').should('contain', 'CHARGING')
    cy.get('[data-testid="charging-live"]').should('be.visible')
    cy.get('[data-testid="action-start"]').should('not.be.visible')
    cy.get('[data-testid="action-cancel"]').should('not.be.visible')
  })

  it('reflects live charging status until ready', () => {
    signInAsChen()
    reserveChargingAt('station-003')
    cy.get('[data-testid="action-start"]').click()
    cy.get('[data-testid="charging-live"]').should('be.visible')

    // Live metrics come from GET …/charging-status (UI polls ~1s). Prefer status assertions over cy.wait(ms).
    cy.get('#m-soc').should('not.contain', '—')
    cy.get('#m-power').should('contain', 'kW')

    cy.get('[data-testid="active-status"]', { timeout: 25000 }).should(
      'contain',
      'READY_FOR_COLLECTION',
    )
    cy.get('[data-testid="action-collect"]').should('be.visible').and('contain', 'Collect bike')
    cy.get('#m-soc').should('contain', '100')
  })

  it('collects the bike and shows a receipt', () => {
    signInAsChen()
    reserveChargingAt('station-003')
    cy.get('[data-testid="action-start"]').click()

    cy.get('[data-testid="action-collect"]', { timeout: 25000 }).should('be.visible')

    cy.intercept('POST', '**/api/v1/services/*/collect').as('collectCharge')
    cy.get('[data-testid="action-collect"]').click()
    cy.wait('@collectCharge').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      const { priceYuan, priceCode, status } = response.body
      expect(status).to.eq('COLLECTED')
      expect(priceYuan).to.be.a('number')

      cy.url().should('include', '/receipt.html')
      cy.get('[data-testid="receipt-page"]').should('be.visible')
      cy.get('[data-testid="receipt-amount"]').should(
        'contain',
        `CNY ${Number(priceYuan).toFixed(2)}`,
      )
      cy.get('[data-testid="receipt-code"]').should('contain', priceCode)
    })
  })
})
