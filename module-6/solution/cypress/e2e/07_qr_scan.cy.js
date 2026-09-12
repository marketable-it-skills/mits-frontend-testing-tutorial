function signInAsLin() {
  cy.visit('/login.html')
  cy.get('[data-testid="login-email"]').clear().type('lin.xiaoyu@swaploop.test')
  cy.get('[data-testid="login-password"]').clear().type('password123')
  cy.get('[data-testid="login-submit"]').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('07 · Station QR scan', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
  })

  it('embeds the QR emulator', () => {
    signInAsLin()
    cy.visit('/scan.html')

    cy.get('[data-testid="scan-page"]').should('be.visible')
    cy.get('[data-testid="qr-emulator"]').should('be.visible')
    cy.get('[data-testid="qr-wc"]').should('be.visible')
    cy.get('[data-testid="qr-emit-btn"]').should('be.visible')
  })

  it('navigates to station hub on a valid poster payload', () => {
    // __reset seeds GET /api/qr/current with station-001 deep link
    signInAsLin()
    cy.visit('/scan.html')

    cy.intercept('GET', '**/api/qr/current').as('qrCurrent')
    cy.get('[data-testid="qr-emit-btn"]').click()
    cy.wait('@qrCurrent')

    cy.get('[data-testid="station-detail-page"]', { timeout: 10000 }).should(
      'be.visible',
    )
    cy.url().should('include', '/station.html')
    cy.url().should('include', 'id=station-001')
    cy.get('[data-testid="station-detail-name"]').should('be.visible')
  })

  it('rejects a mismatched payload', () => {
    cy.request('PUT', '/api/qr/current', {
      payload: 'https://evil.example/not-a-station',
    })

    signInAsLin()
    cy.visit('/scan.html')

    cy.get('[data-testid="qr-emit-btn"]').click()

    cy.get('[data-testid="scan-error"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'QR payload does not match a SwapLoop station poster')

    cy.url().should('include', '/scan.html')
    cy.get('[data-testid="station-detail-page"]').should('not.exist')
  })
})
