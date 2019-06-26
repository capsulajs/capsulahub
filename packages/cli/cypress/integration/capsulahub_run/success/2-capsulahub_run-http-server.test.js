const { cy, describe, it } = global;

describe('Capsulahub run TCs #2 success (HTTPServer)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for HttpServerConfigurationProvider)', () => {
    cy.fixture('port-1111-httpServer/workspace.json').then((configuration) => {
      cy.server()
        .route({
          method: 'POST',
          response: configuration,
          url: 'http://localhost:1111/configuration/workspace',
        })
        .visit(`http://localhost:7778`)
        .testCapsulahubAppRender('PORT 1111 HTTP Server');
    });
  });
});
