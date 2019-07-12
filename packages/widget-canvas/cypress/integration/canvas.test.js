import { grapAllNodes } from '../support/utils';

const { cy, describe, it } = global;

describe('Canvas TCs', () => {
  it('Each node can have one or more tabs according to tabs, activeTabIndex and content parameters', () => {
    cy.fixture('layout.js').then((layout) => {
      return cy.visit('/').then(() => {
        grapAllNodes(layout).forEach(({ activeTabIndex, tabs, id: nodeId }) => {
          tabs.forEach(({ name, content, id: tabId }, index) => {
            if (index === activeTabIndex) {
              cy.get(`[data-cy=canvas-node-${nodeId}]`)
                .find(`[data-cy=canvas-tab-${tabId}]`)
                .find('[data-cy=canvas-tab-title-active]')
                .invoke('text')
                .should('eq', name)
                .get(`[data-cy=canvas-node-${nodeId}]`)
                .find('[data-cy=canvas-content]')
                .invoke('text')
                .should('eq', content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
            } else {
              cy.get(`[data-cy=canvas-node-${nodeId}]`)
                .find(`[data-cy=canvas-tab-${tabId}]`)
                .click()
                .get(`[data-cy=canvas-node-${nodeId}]`)
                .find(`[data-cy=canvas-tab-${tabId}]`)
                .find('[data-cy=canvas-tab-title-active]')
                .invoke('text')
                .should('eq', name)
                .get(`[data-cy=canvas-node-${nodeId}]`)
                .find('[data-cy=canvas-content]')
                .invoke('text')
                .should('eq', content.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
            }
          });
        });
      });
    });
  });

  it('The name of the tab can be edited manually by the user', () => {
    cy.fixture('layout.js').then((layout) => {
      const [{ tabs, id: nodeId }] = grapAllNodes(layout);
      const [{ name, id: tabId }] = tabs;

      return cy
        .visit('/')
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-title-active]')
        .dblclick()
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-input]')
        .invoke('val')
        .should('eq', name)
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-input]')
        .clear()
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-input]')
        .type('{enter}')
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-input]')
        .invoke('val')
        .should('eq', '')
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-input]')
        .type('Test')
        .type('{enter}')
        .get(`[data-cy=canvas-tab-${tabId}]`)
        .find('[data-cy=canvas-tab-title-active]')
        .invoke('text')
        .should('eq', 'Test');
    });
  });

  it('Check that tab can be closed', () => {
    cy.fixture('layout.js').then((layout) => {
      const [{ tabs, id: nodeId }] = grapAllNodes(layout);
      const [{ id: tabId1 }, { id: tabId2 }] = tabs;

      return cy
        .visit('/')
        .get(`[data-cy=canvas-tab-${tabId1}]`)
        .find('[data-cy=canvas-tab-remove]')
        .click()
        .get(`[data-cy=canvas-tab-${tabId1}]`)
        .should('not.exist')
        .get(`[data-cy=canvas-tab-${tabId2}]`)
        .find('[data-cy=canvas-tab-remove]')
        .click()
        .get(`[data-cy=canvas-tab-${tabId2}]`)
        .should('not.exist');
    });
  });

  it('Click on inactive tab will make it active', () => {
    cy.fixture('layout.js').then((layout) => {
      const [{ tabs, id: nodeId }] = grapAllNodes(layout);
      const [{ id: tabId1 }, { id: tabId2 }] = tabs;

      return cy
        .visit('/')
        .get(`[data-cy=canvas-tab-${tabId1}]`)
        .find('[data-cy=canvas-tab-title-active]')
        .get(`[data-cy=canvas-tab-${tabId2}]`)
        .find('[data-cy=canvas-tab-title-active]')
        .should('not.exist')
        .get(`[data-cy=canvas-tab-${tabId2}]`)
        .find('[data-cy=canvas-tab-title]')
        .click()
        .get(`[data-cy=canvas-tab-${tabId2}]`)
        .find('[data-cy=canvas-tab-title]')
        .should('not.exist')
        .get(`[data-cy=canvas-tab-${tabId1}]`)
        .find('[data-cy=canvas-tab-title-active]')
        .should('not.exist');
    });
  });
});
