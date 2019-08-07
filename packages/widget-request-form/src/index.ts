import { RequestForm } from './RequestForm';
import * as API from './api';

declare var publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = RequestForm;
}

export { API };

export default RequestForm;
