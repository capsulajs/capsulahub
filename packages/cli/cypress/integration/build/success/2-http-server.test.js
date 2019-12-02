const { cy, describe, it } = global;

describe('Capsulahub build TCs #2 success (HTTPServer)', () => {
  it('Build CapsulaHub instance with specifying valid arguments (check for HttpServerConfigurationProvider)', () => {
    cy.fixture('port-1111-httpServer/workspace.json').then((configuration) => {
      cy.server()
        .route({
          method: 'POST',
          response: configuration,
          url: 'http://localhost:1111/configuration/workspace',
        })
        .visit('http://localhost:8888', {
          retryOnNetworkFailure: true,
          retryOnStatusCodeFailure: true,
        })
        .testCapsulahubAppRender('PORT 1111 HTTP Server');
    });
  });
});
