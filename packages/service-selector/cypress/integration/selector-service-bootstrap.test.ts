import '../support';
import bootstrap from '../../src/index';
import Selector from '../../src/Selector';
import mocks from '../support/mocks';

describe('Selector Service bootstrap TCs', () => {
  it('Bootstrap registers service correctly', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace);

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(registerServiceRequest.serviceName).to.be.equal('SelectorService');
    expect(registerServiceRequest.reference instanceof Selector).to.be.true;
  });
});
