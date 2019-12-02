import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

declare var publicExports: object;

export class ServiceB {
  public getRandomNumbers() {
    return timer(0, 1000).pipe(map(() => Math.round(Math.random() * 1000)));
  }
}

const bootstrap = (WORKSPACE: any) => {
  return new Promise((resolve) => {
    const serviceB = new ServiceB();
    const registerServiceData = {
      serviceName: 'ServiceB',
      reference: serviceB,
    };
    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
