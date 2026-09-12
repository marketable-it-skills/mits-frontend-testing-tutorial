function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('03 · Stations list', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('lists stations for a signed-in rider', () => {
    signInAsLin()

    cy.get('[data-testid="station-list"]').should('be.visible')
    cy.get('[data-testid="station-card-station-001"]').should('be.visible')
    cy.get('[data-testid="station-card-station-001"]').within(() => {
      cy.get('[data-testid="station-name"]').should('contain', 'Jing')
      cy.get('[data-testid="station-type"]').should('contain', 'HYBRID')
    })
    cy.get('[data-testid="station-card-station-002"]').within(() => {
      cy.get('[data-testid="station-name"]').should('contain', 'Zhangjiang')
      cy.get('[data-testid="station-type"]').should('contain', 'SWAP')
    })
    cy.get('[data-testid^="station-card-"]').should('have.length.at.least', 3)
  })

  it('filters by station type', () => {
    signInAsLin()
    cy.get('[data-testid="filter-swap"]').click()

    cy.url().should('include', 'type=SWAP')
    cy.get('[data-testid="filter-swap"]').should('have.class', 'is-active')
    cy.get('[data-testid^="station-card-"]').should('have.length.at.least', 1)
    cy.get('[data-testid="station-list"] [data-testid="station-type"]').each(($el) => {
      expect($el.text().trim()).to.eq('SWAP')
    })
  })

  it('shows compatible availability indication', () => {
    signInAsLin()

    // Lin is SL-48 swappable — eligible stations show a ready pack message, not the guest hint
    cy.get('[data-testid="station-card-station-001"]')
      .find('[data-testid="station-availability"]')
      .should('be.visible')
      .and('contain', 'SL-48')
      .and('not.contain', 'Sign in')

    cy.get('[data-testid="station-card-station-003"]')
      .find('[data-testid="station-availability"]')
      .should('be.visible')
      .and('contain', 'No ready battery for your profile')
  })

  it('unauthenticated visitors can browse stations', () => {
    cy.visit('/stations.html')

    cy.get('[data-testid="stations-page"]').should('be.visible')
    cy.get('[data-testid="station-list"]').should('be.visible')
    cy.get('[data-testid^="station-card-"]').should('have.length.at.least', 3)
    cy.get('[data-testid="nav-login"]').should('be.visible')
    cy.get('[data-testid="station-availability"]')
      .first()
      .should('contain', 'Sign in to see rider availability')
  })
})
