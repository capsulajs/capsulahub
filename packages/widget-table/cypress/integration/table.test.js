const { cy, describe, it } = global;

describe('Table TCs', () => {
  it('Table columns and data is rendered according to configuration', () => {
    cy.fixture('table.js').then(({ columns, rows }) => {
      return cy
        .visit('/')
        .then(() => {
          columns.forEach(({ Header, accessor }) => {
            cy.contains(Header);
            rows.forEach((row, i) => i < 10 && cy.contains(row[accessor]));
          });
        })
        .window()
        .then((win) => {
          win.tablePropsSubject.next([
            {
              columnA: 'NEW A',
              columnB: 'NEW B',
              columnC: 'NEW C',
            },
          ]);

          return cy.tableShouldContainCells('NEW A', 'NEW B', 'NEW C').tableShouldNotContainCells('A0', 'B0', 'C0');
        });
    });
  });

  it('Filtering is not taking into account case sesitivity', () => {
    cy.fixture('table.js').then(({ columns, rows }) => {
      return cy.visit('/').then(() => {
        cy.get('input')
          .first()
          .type('A0')
          .tableShouldContainCells('A0', 'B0', 'C0')
          .get('input')
          .first()
          .clear()
          .get('input')
          .first()
          .type('a0')
          .tableShouldContainCells('A0', 'B0', 'C0')
          .tableShouldNotContainCells('A1', 'B1', 'C1');
      });
    });
  });

  it('Count of rows per page is according to defaultPageSize', () => {
    cy.fixture('table.js').then(({ columns, rows }) => {
      return cy.visit('/').then(() => {
        cy.get('.rt-tbody')
          .find('.rt-tr-group')
          .should('have.length', 10);
      });
    });
  });
});
