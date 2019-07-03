const { cy, describe, it } = global;

describe('Capsulahub build TCs #3 success', () => {
  it('build CapsulaHub instance without specifying the output and configProvider', () => {
    cy.testCapsulahubAppHttpFile(55555);
  });
});
