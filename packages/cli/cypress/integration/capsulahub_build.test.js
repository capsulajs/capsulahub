import { args } from '../support/const';

const { cy, describe, it } = global;

describe('Capsulahub build TCs', () => {
  // it('Run `capsulahub build` with specifying valid arguments (check for HttpFile provider)', () => {
  //   cy.exec('');
  // });
  //
  // it('Run `capsulahub build` with specifying valid arguments (check for LocalFile, Scalecube, HttpServer and LocalStorage provider)', () => {
  //   cy.exec('');
  // });
  //
  // it('Run `capsulahub build` without specifying the output and configProvider', () => {
  //   cy.exec('');
  // });

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
