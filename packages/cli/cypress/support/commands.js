const { Cypress, cy } = global;

Cypress.Commands.add('testCapsulahubAppRender', (customText) => {
  cy.get('#web-grid web-grid h1')
    .should('have.text', `Capsulahub title: Base Grid from ${customText}`)
    .get('#web-grid web-grid web-component-a h2')
    .should('have.text', `Hello from ComponentA(${customText})`)
    .get('#web-grid web-grid web-component-a #component-a-message')
    .should('have.text', `Message from Service A: Message from ServiceA from ${customText}`);
});

Cypress.Commands.add('testDefaultCapsulahubApp', (appPort, cdnPort = 1111) => {
  let fetchSpy;

  return cy
    .visit(`http://localhost:${appPort}`, {
      retryOnNetworkFailure: true,
      retryOnStatusCodeFailure: true,
      timeout: 30000,
      onBeforeLoad(win) {
        fetchSpy = cy.spy(win, 'fetch');
      },
    })
    .testCapsulahubAppRender(`PORT ${cdnPort} HTTP File`)
    .then(() => {
      expect(fetchSpy.firstCall.args[0]).to.equal(`http://localhost:1111/port-${cdnPort}/configuration/workspace.json`);
    });
});
