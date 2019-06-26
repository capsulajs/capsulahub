const { cy, describe, it } = global;

describe('Capsulahub run TCs #4 success', () => {
  it('Run CapsulaHub instance with the same token on two different ports', () => {
    cy.testDefaultCapsulahubApp(1234);
    cy.testDefaultCapsulahubApp(4321);
  });
});
