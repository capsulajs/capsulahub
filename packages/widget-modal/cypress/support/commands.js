const { Cypress, cy } = global;

Cypress.Commands.add('expectIsModalClosed', ({ title, children }) => {
  cy.get('#web-modal')
    .contains(title)
    .should('not.exist')
    .get('#web-modal')
    .contains(children)
    .should('not.exist');
});

Cypress.Commands.add('expectIsModalOpened', ({ title, children }) => {
  cy.get('#web-modal')
    .contains(title)
    .get('#web-modal')
    .contains(children);
});
