import { args, messages } from '../../../support/const';

const { cy, describe, it } = global;

describe('Capsulahub run TCs', () => {
  it('Run CapsulaHub instance without token throws an error', () => {
    cy.exec('capsulahub run', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.token.error);
    });
  });

  it('Run CapsulaHub instance with invalid port', () => {
    cy.exec('capsulahub run --token=http://localhost:3000/configuration --port=test', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.port.error);
    });
    cy.exec('capsulahub run --token=http://localhost:3000/configuration --port=99999', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.port.error);
    });
  });

  it('Run CapsulaHub instance with a non-existent configProvider throws an error', () => {
    cy.exec('capsulahub run --token=http://localhost:3000/configuration --configProvider=test', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(args.configProvider.error);
    });
  });
});
