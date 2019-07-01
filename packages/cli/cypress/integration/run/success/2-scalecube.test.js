const { cy, describe, it } = global;

describe('Capsulahub run TCs #2 success (Scalecube)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for ScalecubeConfigurationProvider)', () => {
    cy.fixture('port-1111-scalecube/workspace.json').then((configuration) => {
      cy.server().route({
        method: 'POST',
        response: Object.entries(configuration).map((entry) => ({
          key: entry[0],
          value: entry[1],
        })),
        url: 'http://localhost:4000/configuration/entries',
        onRequest: (requestData) => {
          expect(requestData.request.body.token).to.equal('secretToken');
        },
      });
      cy.visit('http://localhost:7780', {
        retryOnNetworkFailure: true,
        retryOnStatusCodeFailure: true,
      }).testCapsulahubAppRender('PORT 1111 Scalecube');
    });
  });
});
