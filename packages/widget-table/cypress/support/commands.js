const { Cypress, cy } = global;

Cypress.Commands.add('tableShouldContainCells', (cellA, cellB, cellC) => {
  cy.get('.ReactTable')
    .contains(cellA)
    .get('.ReactTable')
    .contains(cellB)
    .get('.ReactTable')
    .contains(cellC);
});

Cypress.Commands.add('tableShouldNotContainCells', (cellA, cellB, cellC) => {
  cy.get('.ReactTable')
    .contains(cellA)
    .should('not.exist')
    .get('.ReactTable')
    .contains(cellB)
    .should('not.exist')
    .get('.ReactTable')
    .contains(cellC)
    .should('not.exist');
});
