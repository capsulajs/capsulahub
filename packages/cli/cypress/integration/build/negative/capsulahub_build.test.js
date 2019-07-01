const { cy, describe, it } = global;

describe('Capsulahub build Negative Test Cases', () => {
  it('Run `capsulahub build` with a non-existent configProvider throws an error', () => {
    cy.testConfigProviderValidation('build', 'test')
      .testConfigProviderValidation('build', '')
      .testConfigProviderValidation('build', ' ');
  });

  it('Run `capsulahub build` without token throws an error', () => {
    cy.testTokenValidation('build')
      .testTokenValidation('build', '')
      .testTokenValidation('build', ' ');
  });

  it('Build CapsulaHub instance with a non-existent dispatcherUrl for "scalecube" configProvider throws an error', () => {
    cy.testDispatcherUrlValidation('build')
      .testDispatcherUrlValidation('build', '')
      .testDispatcherUrlValidation('build', ' ');
  });

  it('Run `capsulahub build` with non-existent output throws an error', () => {
    cy.testOutputValidation('build', '').testOutputValidation('build', ' ');
  });
});
