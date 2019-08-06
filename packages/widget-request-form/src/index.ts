import { RequestForm } from './RequestForm';

declare let publicExports: any;

const bootstrap = (): any => {
  return new Promise((resolve) => {
    return resolve(RequestForm);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
