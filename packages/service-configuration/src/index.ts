import bootstrap from './ConfigurationService';
import { API } from '@capsulajs/capsulajs-configuration-service';

declare let publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
