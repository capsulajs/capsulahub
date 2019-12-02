const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    class ServiceD {
      public hello() {
        return Promise.resolve('Hi');
      }
    }

    const serviceD = new ServiceD();

    const registerServiceData = {
      serviceName: 'ServiceD',
      reference: serviceD,
    };
    WORKSPACE.registerService(registerServiceData).catch((error: Error) => console.info(error.message));
    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
