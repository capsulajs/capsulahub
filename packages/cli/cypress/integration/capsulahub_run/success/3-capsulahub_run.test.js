const { cy, describe, it } = global;

describe('Capsulahub run TCs #3 success', () => {
  it('Run CapsulaHub instance without specifying the port and configProvider', () => {
    cy.testDefaultCapsulahubApp(55555);
  });
});
