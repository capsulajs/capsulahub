import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import '../support';
import bootstrap from '../../src/index';
import Selector from '../../src/Selector';
import utils from '../../src/helpers/utils';
import mocks from '../support/mocks';

describe('Selector Service bootstrap TCs', () => {
  it('SelectorService extension bootstrap function resolves correctly and triggers the registration of an instance of SelectorService in Workspace', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace as WORKSPACE_API.Workspace);

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(registerServiceRequest.serviceName).to.be.equal('SelectorService');
    expect(registerServiceRequest.reference instanceof Selector).to.be.true;
  });

  it('SelectorService extension bootstrap function rejects with an error if the creation of an instance of SelectorService throws an error', () => {
    const errorMessage = 'Selector can not be created';
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    //@ts-ignore
    cy.stub(utils, 'getSelectorInstance').throws(Error(errorMessage));
    return bootstrap(fakeWorkspace as WORKSPACE_API.Workspace).catch((error) => {
      expect(error instanceof Error).to.be.true;
      expect(error.message).to.equal(errorMessage);
    });
  });
});
