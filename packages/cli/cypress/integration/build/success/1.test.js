const { cy, describe, it } = global;

describe('Capsulahub build #1 success', () => {
  it('Run `capsulahub build` with specifying valid arguments (check for HttpFile provider)', () => {
    cy.testCapsulahubAppHttpFile(8888);
  });
});
