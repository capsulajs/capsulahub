import bootstrap from './ConnectionService';
import { API } from './api';

declare let publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
