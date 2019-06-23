import '../support';
import bootstrap from '../../src/index';
import TestService from '../../src/Service';
import mocks from '../support/mocks';

describe('Service Template TCs', () => {
  const defaultConfig = { message: 'Hello' };

  it('Bootstrap registers component correctly', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace, defaultConfig);

    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
  });

  it('TestService shows a message', async () => {
    const testService = new TestService(defaultConfig.message);
    return testService.showMessage().then((response: string) => {
      expect(response).to.equal(`response from Service: ${defaultConfig.message}`);
    });
  });
});
