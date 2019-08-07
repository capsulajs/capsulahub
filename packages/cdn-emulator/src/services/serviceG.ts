declare var publicExports: object;

const bootstrap = (WORKSPACE: any) => {
  return new Promise((resolve) => {
    class ServiceG {
      public testServiceG() {
        return Promise.resolve('response for ServiceG');
      }
    }

    const serviceG = new ServiceG();
    const registerServiceData = {
      serviceName: 'ServiceG',
      reference: serviceG,
    };

    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
