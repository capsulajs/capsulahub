const { cy, describe, it } = global;

// TODO Add feature
describe('Capsulahub run TCs #2 success (Scalecube - Custom repository)', () => {
  it('Run CapsulaHub instance with specifying valid arguments (check for ScalecubeConfigurationProvider - custom repository)', () => {
    cy.fixture('port-1111-scalecube/workspace.json').then((configuration) => {
      cy.server().route({
        method: 'POST',
        response: Object.entries(configuration).map((entry) => ({
          key: entry[0],
          value: entry[1],
        })),
        url: 'http://localhost:4000/configuration/readList',
        onRequest: (requestData) => {
          expect(requestData.request.body.apiKey).to.equal('secretToken');
          expect(requestData.request.body.repository).to.equal('customRepository');
        },
      });
      cy.visit('http://localhost:7781', {
        retryOnNetworkFailure: true,
        retryOnStatusCodeFailure: true,
      }).testCapsulahubAppRender('PORT 1111 Scalecube');
    });
  });
});
