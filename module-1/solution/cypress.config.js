const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Local default. Docker Compose overrides via CYPRESS_baseUrl=http://web:3000
    baseUrl: 'http://127.0.0.1:3000',
    supportFile: false,
    video: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
})
