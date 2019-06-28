const { cy, describe, it } = global;

describe('Capsulahub run TCs #5 success', () => {
  it('Run CapsulaHub instance with two different tokens on two different ports (PORT 1234)', () => {
    cy.testCapsulahubAppHttpFile(2345, 1111);
  });

  it('Run CapsulaHub instance with two different tokens on two different ports (PORT 4321)', () => {
    cy.testCapsulahubAppHttpFile(5432, 4444, 'componentB');
  });
});
