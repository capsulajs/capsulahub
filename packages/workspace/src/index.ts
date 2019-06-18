import WorkspaceFactory from './WorkspaceFactory';
import * as API from './api';

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = WorkspaceFactory;
}

export { API };
export default WorkspaceFactory;
