export class ServiceC {
  public hello(name: string) {
    return new Promise((helloResolve, reject) => {
      if (!name) {
        reject('No name to greet has been provided :-(');
      }
      helloResolve(`Hello, ${name}`);
    });
  }
}

const bootstrap = (): Promise<object> => {
  return new Promise(async (resolve) => {
    new ServiceC();

    resolve();
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
