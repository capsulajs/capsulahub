import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import Service from '../../src/Service';
import utils from '../../src/helpers/utils';
import mocks from '../support/mocks';

describe('Service Service bootstrap TCs', () => {
  const serviceName = 'TestService';

  it('Service extension bootstrap function resolves correctly and triggers the registration of an instance of Service in Workspace', (done) => {
    const registerServiceStub = cy.stub();
    const registerServiceStubPromise = new Promise((resolve) => setTimeout(resolve, 500));
    // @ts-ignore
    registerServiceStub.callsFake((registerServiceRequest: WORKSPACE_API.RegisterServiceRequest) => {
      expect(Object.keys(registerServiceRequest).length).to.equal(2);
      expect(registerServiceRequest.serviceName).to.be.equal(serviceName);
      expect(registerServiceRequest.reference instanceof Service).to.be.true;
      return registerServiceStubPromise;
    });
    let isBootstrapResolved = false;
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, { serviceName }).then((response) => {
      expect(response).to.equal(undefined);
      expect(registerServiceStub).to.be.calledOnce;
      isBootstrapResolved = true;
    });

    registerServiceStubPromise.then(() => {
      expect(isBootstrapResolved).to.equal(true);
      done();
    });
  });

  it('Service extension bootstrap function rejects with an error if the creation of an instance of Service throws an error', () => {
    const errorMessage = 'Service can not be created';
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    //@ts-ignore
    cy.stub(utils, 'getServiceInstance').throws(Error(errorMessage));
    return bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, { serviceName }).catch((error) => {
      expect(error instanceof Error).to.be.true;
      expect(error.message).to.equal(errorMessage);
    });
  });
});
