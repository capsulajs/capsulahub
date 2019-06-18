import '../support';
import bootstrap from '../../src/index';
import TestService from '../../src/Service';
import mocks from '../support/mocks';

describe('Service Template TCs', () => {
  const defaultConfig = { message: 'Hello world' };

  const getServiceRef = async ({ config = defaultConfig, useExpect = false } = {}): Promise<TestService> => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace, config);

    useExpect && expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    if (useExpect) {
      expect(Object.keys(registerServiceRequest).length).to.equal(2);
      expect(typeof registerServiceRequest.serviceName === 'string' && !!registerServiceRequest.serviceName).to.be.true;
      expect(registerServiceRequest.reference instanceof TestService).to.be.true;
    }

    return registerServiceRequest.reference;
  };

  it('Bootstrap registers component correctly', () => {
    return getServiceRef({ useExpect: true });
  });

  it('TestService shows a message', async () => {
    const testService = await getServiceRef();
    return testService.showMessage().then((response: string) => {
      expect(response).to.equal(`response from Service: ${defaultConfig.message}`);
    });
  });
});
