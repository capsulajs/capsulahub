import { ServiceA } from './serviceA';
import { ServiceB } from './serviceB';

declare var publicExports: object;

const bootstrap = (WORKSPACE: any) => {
  return new Promise((resolve) => {
    const registerServiceAData = {
      serviceName: 'ServiceA',
      reference: new ServiceA('test message'),
    };
    const registerServiceBData = {
      serviceName: 'ServiceB',
      reference: new ServiceB(),
    };
    WORKSPACE.registerService(registerServiceAData);
    WORKSPACE.registerService(registerServiceBData);
    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
