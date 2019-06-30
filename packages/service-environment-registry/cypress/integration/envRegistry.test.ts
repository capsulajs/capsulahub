import '../support';
import bootstrap from '../../src/index';
import { EnvRegistry } from '@capsulajs/environment-registry';
import mocks from '../support/mocks';

describe('Service EnvRegistry TCs', () => {
  const defaultConfig = { token: 'Hello' };

  it('Bootstrap registers service correctly', async () => {
    const registerServiceStub = cy.stub();
    const fakeWorkspace = mocks.getWorkspaceMock(registerServiceStub);
    await bootstrap(fakeWorkspace, defaultConfig);

    expect(registerServiceStub).to.be.calledOnce;
    // @ts-ignore
    const registerServiceRequest = registerServiceStub.args[0][0];
    expect(Object.keys(registerServiceRequest).length).to.equal(2);
    expect(typeof registerServiceRequest.serviceName === 'string' && !!registerServiceRequest.serviceName).to.be.true;
    expect(registerServiceRequest.reference instanceof EnvRegistry).to.be.true;
  });

  it('EnvRegistry shows a message', async () => {
    const testService = new EnvRegistry(defaultConfig.token);
    return testService.showMessage().then((response: string) => {
      expect(response).to.equal(`response from Service: ${defaultConfig.token}`);
    });
  });
});
