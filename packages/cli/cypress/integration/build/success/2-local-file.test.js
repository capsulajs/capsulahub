const { cy, describe, it } = global;

describe('Capsulahub build TCs #2 success (LocalFile)', () => {
  it('Build CapsulaHub instance with specifying valid arguments (check for LocalFileConfigurationProvider)', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=localFile').then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"localFile"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
    });
  });
});
