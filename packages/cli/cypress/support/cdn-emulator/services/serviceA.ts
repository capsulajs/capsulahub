import { API } from '@capsulajs/capsulahub-workspace';

declare var publicExports: object;

const bootstrap = (WORKSPACE: API.Workspace, SERVICE_CONFIG: { message: string }) => {
  return new Promise((resolve) => {
    class ServiceA {
      private message: string;
      constructor(message: string) {
        this.message = message;
      }

      public getMessage() {
        return Promise.resolve(`Message from Service A: ${this.message}`);
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

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
