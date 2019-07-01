import { messages } from '../../../support/const';

const { cy, describe, it } = global;

describe('Capsulahub run TCs #4 negative', () => {
  it('Run CapsulaHub instance twice on the same port', () => {
    cy.exec('capsulahub run --token=http://localhost:1111/port-1111/configuration --port=8888', {
      failOnNonZeroExit: false,
    }).then((obj) => {
      expect(obj.code).to.eq(1);
      expect(obj.stderr).to.contain(messages.portAlreadyInUse(8888));
    });
  });
});
