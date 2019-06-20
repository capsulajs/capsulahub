const { cy, describe, it } = global;

const validateTimeFormat = (text) => /^([0-9]{2})\:([0-9]{2}):([0-9]{2})$/.test(text);

const checkRow = (row, log) => {
  const { type, serviceName, methodName, content } = log;

  type === 'request' ? row.find('[data-cy=logger-arrows-green]') : row.find('[data-cy=logger-arrows-red]');
  row.find('[data-cy=logger-point-not-active]');

  expect(validateTimeFormat(row.find('[data-cy=logger-timestamp]').text())).to.eq(true);
  expect(row.find('[data-cy=logger-title]').text()).to.eq(`${serviceName}/${methodName}`);
  expect(
    row
      .find('[data-cy=logger-content]')
      .find('.string-value')
      .text()
  ).to.eq(`"${content}"`);
};

describe('Logger TCs', () => {
  it('Events are logged (check the format)', () => {
    cy.fixture('logs.js').then((logs) => {
      logs.forEach((log, i) => {
        return cy
          .visit('/')
          .wait(log.delay)
          .get(`[data-cy=logger-row-${i}]`)
          .should((row) => checkRow(row, log));
      });
    });
  });

  it('Check delete cross to remove all logs', () => {
    cy.fixture('logs.js').then((logs) => {
      return cy
        .visit('/')
        .wait(logs[2].delay)
        .get('[data-cy=logger-row-0]')
        .get('[data-cy=logger-row-1]')
        .get('[data-cy=logger-row-2]')
        .get('[data-cy=logger-row-3]')
        .get('[data-cy=logger-clear]')
        .click()
        .get('[data-cy=logger-row-0]')
        .should('not.exist')
        .get('[data-cy=logger-row-1]')
        .should('not.exist')
        .get('[data-cy=logger-row-2]')
        .should('not.exist')
        .get('[data-cy=logger-row-3]')
        .should('not.exist')
        .wait(logs[0].delay)
        .get('[data-cy=logger-row-0]')
        .should((row) => checkRow(row, logs[4]));
    });
  });

  it('Hovering on the dot near to log will change the color of all the dots of the logs with the same service/method name', () => {
    cy.fixture('logs.js').then((logs) => {
      return cy
        .visit('/')
        .wait(logs[4].delay)
        .get('[data-cy=logger-row-0]')
        .find('[data-cy=logger-point-not-active]')
        .trigger('mouseover')
        .get('[data-cy=logger-point-active]')
        .should('have.length', 4)
        .get('[data-cy=logger-row-4]')
        .find('[data-cy=logger-point-not-active]')
        .trigger('mouseover')
        .get('[data-cy=logger-point-active]')
        .should('have.length', 1)
        .get('[data-cy=logger-row-0]')
        .find('[data-cy=logger-point-not-active]')
        .click()
        .get('[data-cy=logger-point-active]')
        .should('have.length', 4)
        .get('[data-cy=logger-row-4]')
        .find('[data-cy=logger-point-not-active]')
        .click()
        .get('[data-cy=logger-point-not-active]')
        .should('have.length', 5);
    });
  });
});
