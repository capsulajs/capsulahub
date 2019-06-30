import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import * as API from './api';
import utils from './helpers/utils';

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
