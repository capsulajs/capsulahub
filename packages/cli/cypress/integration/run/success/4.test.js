const { cy, describe, it } = global;

describe('Capsulahub run TCs #4 success', () => {
  it('Run CapsulaHub instance with the same token on two different ports (PORT 1234)', () => {
    cy.testCapsulahubAppHttpFile(1234);
  });

  it('Run CapsulaHub instance with the same token on two different ports (PORT 4321)', () => {
    cy.testCapsulahubAppHttpFile(4321);
  });
});
