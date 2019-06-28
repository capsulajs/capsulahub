const { Cypress, cy } = global;

Cypress.Commands.add('testCapsulahubAppRender', (customText, componentName = 'componentA') => {
  let componentGetSelector;
  let componentGetMessageSelector;
  let componentText;
  let componentMessageText;
  switch (componentName) {
    case 'componentA': {
      componentGetSelector = '#web-grid web-grid web-component-a h2';
      componentGetMessageSelector = '#web-grid web-grid web-component-a #component-a-message';
      componentText = `Hello from ComponentA(${customText})`;
      componentMessageText = `Message from Service A: Message from ServiceA from ${customText}`;
      break;
    }
    case 'componentB': {
      componentGetSelector = '#web-grid web-grid web-component-b h2';
      componentGetMessageSelector = '#web-grid web-grid web-component-b #component-b-message';
      componentText = 'I am ComponentB!';
      componentMessageText = `Message from Service A: Message from ServiceA from ${customText}`;
      break;
    }
  }

  cy.get('#web-grid web-grid h1')
    .should('have.text', `Capsulahub title: Base Grid from ${customText}`)
    .get(componentGetSelector)
    .should('have.text', componentText)
    .get(componentGetMessageSelector)
    .should('have.text', componentMessageText);
});

Cypress.Commands.add('testCapsulahubAppHttpFile', (appPort, cdnPort = 1111, componentName) => {
  let fetchSpy;

  return cy
    .visit(`http://localhost:${appPort}`, {
      retryOnNetworkFailure: true,
      retryOnStatusCodeFailure: true,
      onBeforeLoad(win) {
        fetchSpy = cy.spy(win, 'fetch');
      },
    })
    .testCapsulahubAppRender(`PORT ${cdnPort} HTTP File`, componentName)
    .then(() => {
      expect(fetchSpy.firstCall.args[0]).to.equal(
        `http://localhost:${cdnPort}/port-${cdnPort}/configuration/workspace.json`
      );
    });
});
