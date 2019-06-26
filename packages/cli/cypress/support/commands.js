const { Cypress, cy } = global;

Cypress.Commands.add('testCapsulahubAppRender', (customText) => {
  cy.get('#web-grid web-grid h1')
    .should('have.text', `Capsulahub title: Base Grid from ${customText}`)
    .get('#web-grid web-grid web-component-a h2')
    .should('have.text', `Hello from ComponentA(${customText})`)
    .get('#web-grid web-grid web-component-a #component-a-message')
    .should('have.text', `Message from Service A: Message from ServiceA from ${customText}`);
});

Cypress.Commands.add('testDefaultCapsulahubApp', (port) => {
  let fetchSpy;

  return cy
    .visit(`http://localhost:${port}`, {
      onBeforeLoad(win) {
        fetchSpy = cy.spy(win, 'fetch');
      },
    })
    .testCapsulahubAppRender('PORT 1111 HTTP File')
    .then(() => {
      expect(fetchSpy.firstCall.args[0]).to.equal('http://localhost:1111/port-1111/configuration/workspace.json');
    });
});
