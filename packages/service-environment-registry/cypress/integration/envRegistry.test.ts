import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import { EnvRegistry } from '@capsulajs/environment-registry';
import mocks from '../support/mocks';

describe('Service EnvRegistry TCs', () => {
  const defaultConfig = { token: 'Hello' };

  it('EnvRegistry extension bootstrap function resolves correctly and triggers the registration of an instance of EnvRegistry in Workspace', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, defaultConfig);

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(registerServiceRequest.serviceName).to.be.equal('EnvironmentRegistryService');
    expect(registerServiceRequest.reference instanceof EnvRegistry).to.be.true;

    const envRegistry = new EnvRegistry(defaultConfig.token);
    await envRegistry.register({ envKey: 'develop', env: { test: 'test' } });
    return envRegistry.environments$({}).subscribe((response) => {
      expect(response).to.equal({ envKey: 'develop', env: { test: 'test' } });
    });
  });

  it('EnvRegistry extension bootstrap function rejects with an error if the creation of an instance of EnvRegistry throws an error', () => {
    const errorMessage = 'Service can not be created';
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    // @ts-ignore
    cy.stub(utils, 'getServiceInstance').throws(Error(errorMessage));
    return bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, defaultConfig).catch((error) => {
      expect(error instanceof Error).to.be.true;
      expect(error.message).to.equal(errorMessage);
    });
  });
});
