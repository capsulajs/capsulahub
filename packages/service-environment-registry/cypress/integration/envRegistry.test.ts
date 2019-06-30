import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import { EnvRegistry } from '@capsulajs/environment-registry';
import mocks from '../support/mocks';

describe('Service EnvRegistry TCs', () => {
  const defaultConfig = { token: 'Hello' };

  it('Bootstrap registers service correctly', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, defaultConfig);

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(typeof registerServiceRequest.serviceName === 'string' && !!registerServiceRequest.serviceName).to.be.true;
    expect(registerServiceRequest.reference instanceof EnvRegistry).to.be.true;
  });

  it('EnvRegistry shows a message', async () => {
    const envRegistry = new EnvRegistry(defaultConfig.token);
    await envRegistry.register({ envKey: 'develop', env: { test: 'test' } });
    return envRegistry.environments$({}).subscribe((response) => {
      expect(response).to.equal({ envKey: 'develop', env: { test: 'test' } });
    });
  });
});
