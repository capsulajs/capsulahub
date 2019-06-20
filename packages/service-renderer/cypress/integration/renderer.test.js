const { cy, describe, it } = global;

describe('Renderer resolves TCs', () => {
  it('Calling renderLayouts renders the layouts from configuration', () => {
    const onBeforeLoad = (window) => {
      window.mockComponents = ['LayoutABC', 'ItemA', 'ItemB', 'ItemC'];
    };

    cy.visit('/', { onBeforeLoad })
      .get('[data-cy=layout-abc]')
      .should('not.exist')
      .window()
      .then(async ({ rendererService }) => {
        await rendererService.renderLayouts();
      })
      .get('[data-cy=layout-abc]');
  });

  it('Calling renderItems renders items from configuration', () => {
    const onBeforeLoad = (window) => {
      window.mockComponents = ['LayoutABC', 'ItemA', 'ItemB', 'ItemC'];
    };

    cy.visit('/', { onBeforeLoad })
      .get('[data-cy=layout-abc]')
      .should('not.exist')
      .window()
      .then(async ({ rendererService }) => {
        await rendererService.renderLayouts();
        await rendererService.renderItems();
      })
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-a]')
      .contains('Item A')
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-b]')
      .contains('Item B')
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-c]')
      .contains('Item C');
  });

  it('Calling renderItem with nodeId renders the relevant item', () => {
    const onBeforeLoad = (window) => {
      window.mockComponents = ['LayoutABC', 'ItemA', 'ItemB', 'ItemC'];
    };

    cy.visit('/', { onBeforeLoad })
      .get('[data-cy=layout-abc]')
      .should('not.exist')
      .window()
      .then(async ({ rendererService }) => {
        await rendererService.renderLayouts();
        await rendererService.renderItem({ nodeId: 'item-a' });
      })
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-a]')
      .contains('Item A')
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-b]')
      .should('not.exist')
      .get('[data-cy=layout-abc]')
      .find('[data-cy=item-c]')
      .should('not.exist');
  });
});
