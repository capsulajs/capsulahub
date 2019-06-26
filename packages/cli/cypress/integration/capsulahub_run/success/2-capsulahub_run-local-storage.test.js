const { cy, describe, it } = global;

describe('Capsulahub run TCs #2 success (Local Storage)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for LocalFile)', () => {
    let getItemSpy;

    cy.fixture('port-1111-localStorage/workspace.json').then((configuration) => {
      cy.visit(`http://localhost:7777`, {
        onBeforeLoad(win) {
          win.localStorage.setItem('configuration.workspace', JSON.stringify(configuration));
          getItemSpy = cy.spy(win.localStorage, 'getItem');
        },
      })
        .testCapsulahubAppRender('PORT 1111 LocalStorage')
        .then(() => {
          expect(getItemSpy.firstCall.args[0]).to.equal('configuration.workspace');
        });
    });
  });
});
