import { EnvRegistry } from '@capsulajs/environment-registry';
import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import mocks from '../support/mocks';
import utils from '../../src/helpers/utils';

describe('Service EnvRegistry TCs', () => {
  const defaultConfig = { serviceName: 'EnvironmentRegistryService', token: 'Hello' };

  it('EnvRegistry extension bootstrap function resolves correctly and triggers the registration of an instance of EnvRegistry in Workspace', (done) => {
    const registerServiceStub = cy.stub();
    const spy = cy.spy(utils, 'getServiceInstance');
    const registerServiceStubPromise = new Promise((resolve) => setTimeout(resolve, 500));
    // @ts-ignore
    registerServiceStub.callsFake((registerServiceRequest: WORKSPACE_API.RegisterServiceRequest) => {
      expect(Object.keys(registerServiceRequest).length).to.equal(2);
      expect(registerServiceRequest.serviceName).to.be.equal('EnvironmentRegistryService');
      expect(registerServiceRequest.reference instanceof EnvRegistry).to.equal(true);
      return registerServiceStubPromise;
    });

    let isBootstrapResolved = false;
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, defaultConfig).then((response) => {
      expect(response).to.equal(undefined);
      expect(registerServiceStub).to.be.callCount(1);
      isBootstrapResolved = true;
      // @ts-ignore
      expect(spy.args[0][0].token).to.equal(defaultConfig.token);
    });

    registerServiceStubPromise.then(() => {
      expect(isBootstrapResolved).to.equal(true);
      done();
    });
  });

  it('EnvRegistry extension bootstrap function rejects with an error if the creation of an instance of EnvRegistry throws an error', () => {
    const errorMessage = 'Service can not be created';
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    // @ts-ignore
    cy.stub(utils, 'getServiceInstance').throws(Error(errorMessage));
    return bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, defaultConfig).catch((error: Error) => {
      expect(error instanceof Error).to.equal(true);
      expect(error.message).to.equal(errorMessage);
    });
  });
});
