const { cy, describe, it } = global;

describe('Workspace integration', () => {
  it('Basic test of dynamic import', () => {
    cy.visit('/')
      .get('web-grid')
      .should('have.text', 'Hello from Grid!')
      .get('web-request-form')
      .get('#request-form h1')
      .should('have.text', 'Hello from request form')
      .get('#request-form h2')
      .should('have.text', 'Dear Superuser, what pill would you choose: red or blue?');
  });
});
