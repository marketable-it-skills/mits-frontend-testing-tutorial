function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

function openStation(stationId) {
  cy.get(`[data-testid="station-card-${stationId}"]`).click()
  cy.get('[data-testid="station-detail-page"]').should('be.visible')
  cy.url().should('include', `id=${stationId}`)
}

describe('04 · Station detail and reserve', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('opens station detail from a list card', () => {
    signInAsLin()
    openStation('station-001')

    cy.get('[data-testid="station-detail-name"]').should('contain', 'Jing')
    cy.get('[data-testid="station-detail-type"]').should('contain', 'HYBRID')
    cy.get('[data-testid="station-detail-status"]').should('contain', 'ACTIVE')
    cy.get('[data-testid="station-detail-availability"]').should('be.visible')
    cy.get('[data-testid="reserve-btn"]').should('be.visible')
  })

  it('reserves a swap hold when eligible', () => {
    signInAsLin()
    openStation('station-001')

    cy.get('[data-testid="reserve-btn"]')
      .should('not.be.disabled')
      .and('contain', 'Reserve battery')
      .click()

    cy.url().should('include', '/activity.html')
    cy.get('[data-testid="activity-page"]').should('be.visible')
  })

  it('surfaces last-charge conflict without inventing availability', () => {
    signInAsLin()
    cy.request('POST', '/api/v1/__force-conflict')
    openStation('station-002')

    cy.get('[data-testid="reserve-btn"]').should('not.be.disabled').click()

    cy.get('[data-testid="station-error"]')
      .should('be.visible')
      .and('contain', 'not available anymore')

    // Stay on station hub — reserve must not look successful
    cy.url().should('include', '/station.html')
    cy.get('[data-testid="activity-page"]').should('not.exist')

    // UI refreshes availability from the API (count zeroed) — do not invent badge text
    cy.get('[data-testid="station-detail-availability"]')
      .should('contain', 'No ready battery for your profile')
    cy.get('[data-testid="station-ready-badge"]').should('contain', 'NOT AVAILABLE')
  })

  it('blocks a second reserve while another station hold is active', () => {
    signInAsLin()
    openStation('station-001')
    cy.get('[data-testid="reserve-btn"]').click()
    cy.get('[data-testid="activity-page"]').should('be.visible')

    cy.visit('/stations.html')
    openStation('station-002')
    cy.get('[data-testid="reserve-btn"]').click()

    cy.get('[data-testid="station-error"]')
      .should('be.visible')
      .and('contain', 'active service at another station')

    cy.get('[data-testid="nav-activity"]').click()
    cy.url().should('include', '/activity.html')
    cy.get('[data-testid="activity-page"]').should('be.visible')
  })
})
