import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import Service from '../../src/Service';
import utils from '../../src/helpers/utils';
import mocks from '../support/mocks';

describe('Service Service bootstrap TCs', () => {
  const serviceName = 'TestService';

  it('Service extension bootstrap function resolves correctly and triggers the registration of an instance of Service in Workspace', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace as WORKSPACE_API.Workspace, { serviceName });

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(registerServiceRequest.serviceName).to.be.equal(serviceName);
    expect(registerServiceRequest.reference instanceof Service).to.be.true;
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
