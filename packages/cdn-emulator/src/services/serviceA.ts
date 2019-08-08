declare var publicExports: object;

export class ServiceA {
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

const bootstrap = (WORKSPACE: any, SERVICE_CONFIG: any) => {
  return new Promise((resolve) => {
    const serviceA = new ServiceA(SERVICE_CONFIG.message);

    const registerServiceData = {
      serviceName: 'ServiceA',
      reference: serviceA,
    };

    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
