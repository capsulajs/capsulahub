import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import Selector from './Selector';
import * as API from './api';

declare let publicExports: object;

const bootstrap = (WORKSPACE: WORKSPACE_API.Workspace) => {
  return new Promise((resolve) => {
    const selectorService = new Selector();

    const registerServiceData = {
      serviceName: 'SelectorService',
      reference: selectorService,
    };

    WORKSPACE.registerService(registerServiceData);
    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export { API };
export default bootstrap;
