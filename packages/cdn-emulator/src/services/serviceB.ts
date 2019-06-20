import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

const bootstrap = (WORKSPACE: any) => {
  return new Promise(async (resolve) => {
    class ServiceB {
      public getRandomNumbers() {
        return timer(0, 1000).pipe(map(() => Math.round(Math.random() * 1000)));
      }
    }

    const serviceB = new ServiceB();

    const registerServiceData = {
      serviceName: 'ServiceB',
      reference: serviceB,
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
