const { cy, describe, it } = global;

describe('Capsulahub run TCs #1 success', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for HttpFile provider)', () => {
    cy.testCapsulahubAppHttpFile(8888);
  });
});
