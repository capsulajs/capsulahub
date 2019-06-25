const { cy, describe, it } = global;

describe('Capsulahub run TCs', () => {
  it('Open the page', () => {
    cy.visit('http://localhost:55555');
  });
});
