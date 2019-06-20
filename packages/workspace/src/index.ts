import WorkspaceFactory from './WorkspaceFactory';
import * as API from './api';

declare let publicExports: object;

if (typeof publicExports !== 'undefined') {
  publicExports = WorkspaceFactory;
}

export { API };
export default WorkspaceFactory;
