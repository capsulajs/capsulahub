const { cy, describe, it } = global;

describe('Capsulahub build TCs', () => {
  // ++++++++++++++ Positive Test Cases ++++++++++++++
  it('Run `capsulahub build` with specifying valid arguments (check for HttpFile provider)', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --output=outputDir').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('outputDir'));
      cy.exec('cat outputDir/app.*.js | grep \'createWorkspace({.*configProvider:"httpFile"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
  });

  it('Run `capsulahub build` with specifying valid arguments (check for LocalFile, Scalecube, HttpServer and LocalStorage provider)', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=localFile').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"localFile"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
    cy.exec(
      'capsulahub build --token=http://localhost:3000/configuration --configProvider=scalecube --dispatcherUrl=http://dispatcher'
    ).then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec(
        'cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"scalecube".*dispatcherUrl:"http://dispatcher"\''
      ).then(({ code }) => expect(code).to.eq(0));
    });
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=httpServer').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"httpServer"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=localStorage').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"localStorage"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
  });

  it('Run `capsulahub build` without specifying the output and configProvider', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"httpFile"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
  });

  // -------------- Negative Test Cases --------------
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
    cy.testDispatcherUrlValidation('build', '').testDispatcherUrlValidation('build', ' ');
  });

  it('Run `capsulahub build` with non-existent output throws an error', () => {
    cy.testOutputValidation('build', '').testOutputValidation('build', ' ');
  });
});
