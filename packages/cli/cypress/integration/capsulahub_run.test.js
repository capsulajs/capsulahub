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
});
