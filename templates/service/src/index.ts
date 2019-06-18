import TestService from './Service';
import * as API from './api';

const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise(async (resolve) => {
    const testService = new TestService(SERVICE_CONFIG.message);

    const registerServiceData = {
      serviceName: 'TestService',
      reference: testService,
    };

    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
