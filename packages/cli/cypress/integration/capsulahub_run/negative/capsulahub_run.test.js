const { cy, describe, it } = global;

describe('Capsulahub run TCs', () => {
  it('Run CapsulaHub instance without token throws an error', () => {
    cy.testTokenValidation('run')
      .testTokenValidation('run', '')
      .testTokenValidation('run', ' ');
  });

  it('Run CapsulaHub instance with invalid port', () => {
    cy.testPortValidation('run', 'test')
      .testPortValidation('run', '')
      .testPortValidation('run', ' ')
      .testPortValidation('run', '99999');
  });

  it('Run CapsulaHub instance with a non-existent configProvider throws an error', () => {
    cy.testConfigProviderValidation('run', 'test')
      .testConfigProviderValidation('run', '')
      .testConfigProviderValidation('run', ' ');
  });

  it('Run CapsulaHub instance with a non-existent dispatcherUrl for "scalecube" configProvider throws an error', () => {
    cy.testDispatcherUrlValidation('run', '').testDispatcherUrlValidation('run', ' ');
  });
});
