import { args } from '../support/const';

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
    // Note: dispatcherUrl is not checked by the cli
    cy.exec(
      'capsulahub build --token=http://localhost:3000/configuration --configProvider=scalecube --dispatcherUrl=http://dispatcher'
    ).then(() => {
      cy.exec('ls').then(({ stdout }) => expect(stdout).to.contain('dist'));
      cy.exec('cat dist/app.*.js | grep \'createWorkspace({.*configProvider:"scalecube"\'').then(({ code }) =>
        expect(code).to.eq(0)
      );
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
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --configProvider=test', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.configProvider.error);
    });
  });

  it('Run `capsulahub build` without token throws an error', () => {
    cy.exec('capsulahub build', { failOnNonZeroExit: false }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.token.error);
    });
  });

  it('Run `capsulahub build` with non-existent output throws an error', () => {
    cy.exec('capsulahub build --token=http://localhost:3000/configuration --output= ', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.output.error);
    });
  });
});
