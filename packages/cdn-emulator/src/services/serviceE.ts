import serviceGBootstrap from './serviceG';

declare var publicExports: object;

const bootstrap = (WORKSPACE: any) => {
  return serviceGBootstrap(WORKSPACE).then(() => {
    class ServiceE {
      public testServiceE() {
        return Promise.resolve('response for ServiceE');
      }
    }

    const serviceE = new ServiceE();
    const registerServiceData = {
      serviceName: 'ServiceE',
      reference: serviceE,
    };

    WORKSPACE.registerService(registerServiceData);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
