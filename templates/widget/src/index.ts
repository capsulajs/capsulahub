import Widget from './Widget';
import * as API from './api';

declare let publicExports: object;

const bootstrap = (): Promise<new () => HTMLElement> => {
  return new Promise((resolve) => {
    return resolve(Widget);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
