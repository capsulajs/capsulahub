import Component from './Component';
import * as API from './api';

declare let publicExports: any;

const bootstrap = (): Promise<new () => HTMLElement> => {
  return new Promise((resolve) => {
    return resolve(Component);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
