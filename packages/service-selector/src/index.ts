import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import utils from './helpers/utils';
import * as API from './api';

declare let publicExports: object;

const bootstrap = (WORKSPACE: WORKSPACE_API.Workspace, SERVICE_CONFIG: { serviceName: string }) => {
  return new Promise((resolve) => {
    const registerServiceData = {
      serviceName: SERVICE_CONFIG.serviceName,
      reference: utils.getServiceInstance(),
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
