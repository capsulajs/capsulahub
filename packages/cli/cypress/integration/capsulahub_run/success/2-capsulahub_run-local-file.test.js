const { cy, describe, it } = global;

describe('Capsulahub run TCs #2 success (LocalFile)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for LocalFileConfigurationProvider)', () => {
    cy.visit('http://localhost:7779', {
      retryOnNetworkFailure: true,
      retryOnStatusCodeFailure: true,
      timeout: 30000,
    }).testCapsulahubAppRender('PORT 1111 LOCAL File');
  });
});
