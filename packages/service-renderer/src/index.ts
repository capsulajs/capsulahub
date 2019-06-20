import bootstrap from './RendererService';
import * as API from './api';

declare let publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
