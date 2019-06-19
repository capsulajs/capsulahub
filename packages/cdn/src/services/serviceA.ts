const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise((resolve) => {
    class ServiceA {
      private message: string;
      constructor(message: string) {
        this.message = message;
      }

      public greet(name: string) {
        return new Promise((greetResolve, reject) => {
          if (!name) {
            reject('No name to greet has been provided :-(');
          }
          greetResolve(`Dear ${name}, ${this.message}`);
        });
      }
    }

    const serviceA = new ServiceA(SERVICE_CONFIG.message);

    const registerServiceData = {
      serviceName: 'ServiceA',
      reference: serviceA,
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

export default bootstrap;
