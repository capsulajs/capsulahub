const { cy, describe, it } = global;

describe('Capsulahub run TCs #5 success', () => {
  it('Run CapsulaHub instance with two different tokens on two different ports', () => {
    cy.testDefaultCapsulahubApp(1234);
    cy.testDefaultCapsulahubApp(4321, 4444);
  });
});
