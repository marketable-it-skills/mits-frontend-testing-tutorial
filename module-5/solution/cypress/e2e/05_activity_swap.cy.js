function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

/** Reserve a swap hold for Lin and land on Activity. */
function reserveSwapAt(stationId) {
  cy.visit(`/station.html?id=${stationId}`)
  cy.get('[data-testid="station-detail-page"]').should('be.visible')
  cy.get('[data-testid="reserve-btn"]')
    .should('not.be.disabled')
    .and('contain', 'Reserve battery')
    .click()
  cy.url().should('include', '/activity.html')
  cy.get('[data-testid="activity-page"]').should('be.visible')
  cy.get('[data-testid="activity-active"]').should('be.visible')
}

describe('05 · Activity — swap', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('shows countdown and actions while reserved', () => {
    signInAsLin()
    reserveSwapAt('station-001')

    cy.get('[data-testid="active-type"]').should('contain', 'SWAP')
    cy.get('[data-testid="active-status"]').should('contain', 'RESERVED')
    cy.get('[data-testid="active-station"]').should('contain', 'Jing')
    cy.get('[data-testid="active-countdown"]').should('be.visible')
    cy.get('#countdown-secs').should('not.contain', '—')
    cy.get('[data-testid="action-start"]')
      .should('be.visible')
      .and('contain', 'Start swapping')
    cy.get('[data-testid="action-cancel"]').should('be.visible')
    cy.get('[data-testid="action-confirm"]').should('not.be.visible')
  })

  it('starts and confirms a swap', () => {
    signInAsLin()
    reserveSwapAt('station-001')

    cy.get('[data-testid="action-start"]').click()
    cy.get('[data-testid="active-status"]').should('contain', 'STARTED')
    cy.get('[data-testid="action-confirm"]')
      .should('be.visible')
      .and('contain', 'Confirm swap')
    cy.get('[data-testid="active-countdown"]').should('not.be.visible')

    // Assert receipt fields from the real confirm API payload — do not invent amounts
    cy.intercept('POST', '**/api/v1/services/*/confirm').as('confirmSwap')
    cy.get('[data-testid="action-confirm"]').click()
    cy.wait('@confirmSwap').then(({ response }) => {
      expect(response.statusCode).to.eq(200)
      const { priceYuan, priceCode, status } = response.body
      expect(status).to.eq('CONFIRMED')
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

  it('cancels a reserved swap', () => {
    signInAsLin()
    reserveSwapAt('station-001')

    cy.get('[data-testid="action-cancel"]').should('be.visible').click()

    cy.get('[data-testid="activity-empty"]').should('be.visible')
    cy.get('[data-testid="activity-active"]').should('not.be.visible')
    cy.get('[data-testid="activity-empty-link"]').should('be.visible')
  })
})
