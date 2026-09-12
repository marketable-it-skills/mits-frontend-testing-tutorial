function fillRegisterBasics({ email, password = 'password123', displayName }) {
  cy.get('[data-testid="register-email"]').clear().type(email)
  cy.get('[data-testid="register-password"]').clear().type(password)
  cy.get('[data-testid="register-display-name"]').clear().type(displayName)
}

function completeAlipayAndCreate() {
  cy.get('[data-testid="register-step2"]').should('be.visible')
  cy.get('[data-testid="alipay-status"]').should('contain', 'Alipay linked')
  cy.get('[data-testid="register-create"]').should('not.be.disabled').click()
  cy.get('[data-testid="stations-page"]').should('be.visible')
}

describe('02 · Register', () => {
  beforeEach(() => {
    cy.request('DELETE', '/api/v1/__reset')
    cy.visit('/register.html')
  })

  it('requires vehicle profile fields for swappable mode', () => {
    fillRegisterBasics({
      email: 'missing.battery@swaploop.test',
      displayName: 'Missing Battery',
    })

    // Select always has a default — clear it to simulate missing battery type
    cy.get('[data-testid="register-battery-type"]').invoke('val', '').trigger('change')
    cy.get('[data-testid="register-next"]').click()

    cy.get('[data-testid="register-error"]')
      .should('be.visible')
      .and('contain', 'batteryType is required for SWAPPABLE')

    // Must not advance to Alipay / create an account
    cy.get('[data-testid="register-step1"]').should('be.visible')
    cy.get('[data-testid="register-step2"]').should('not.be.visible')
    cy.url().should('include', '/register.html')
  })

  it('completes two-step register for a swappable rider', () => {
    fillRegisterBasics({
      email: 'new.swappable@swaploop.test',
      displayName: 'New Swappable',
    })
    cy.get('[data-testid="register-mode-swappable"]').click()
    cy.get('[data-testid="register-battery-type"]').select('SL-48')
    cy.get('[data-testid="register-next"]').click()

    completeAlipayAndCreate()
    cy.url().should('include', '/stations.html')
    cy.get('[data-testid="user-chip"]').should('contain', 'New Swappable')
  })

  it('completes two-step register for an integrated rider', () => {
    fillRegisterBasics({
      email: 'new.integrated@swaploop.test',
      displayName: 'New Integrated',
    })
    cy.get('[data-testid="register-mode-integrated"]').click()
    cy.get('[data-testid="register-integrated-fields"]').should('be.visible')
    cy.get('[data-testid="register-swappable-fields"]').should('not.be.visible')
    cy.get('[data-testid="register-connector-type"]').select('GB-AC-48')
    cy.get('[data-testid="register-next"]').click()

    completeAlipayAndCreate()
    cy.url().should('include', '/stations.html')
    cy.get('[data-testid="user-chip"]').should('contain', 'New Integrated')
  })
})
