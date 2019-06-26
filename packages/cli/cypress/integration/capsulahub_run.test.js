import { args } from '../support/const';

const { cy, describe, it } = global;

describe('Capsulahub run TCs', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for HttpFile provider)', () => {
    let fetchSpy;

    cy.visit('http://localhost:8888', {
      onBeforeLoad(win) {
        fetchSpy = cy.spy(win, 'fetch');
      },
    })
      .get('#web-grid web-grid h1')
      .should('have.text', 'Capsulahub title: Base Grid from PORT 1111')
      .get('#web-grid web-grid web-component-a h2')
      .should('have.text', 'Hello from ComponentA(PORT 1111)')
      .get('#web-grid web-grid web-component-a #component-a-message')
      .should('have.text', 'Message from Service A: Message from ServiceA from PORT 1111')
      .then(() => {
        expect(fetchSpy.firstCall.args[0]).to.equal('http://localhost:1111/port-1111/configuration/workspace.json');
      });
  });

  // ____________  Negative _______________ //
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

  it('Run CapsulaHub instance twice on the same port', () => {
    cy.exec('capsulahub run --token=http://localhost:3000/configuration --port=8888').then(() => {
      cy.exec('capsulahub run --token=http://localhost:3000/configuration --port=8888', {
        failOnNonZeroExit: false,
      }).then((obj) => {
        expect(obj.code).to.eq(1);
        expect(obj.stderr).to.contain(args.configProvider.error);
      });
    });
  });
});
