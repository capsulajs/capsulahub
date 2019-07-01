import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import * as API from './api';
import utils from './helpers/utils';

declare let publicExports: object;

const bootstrap = (WORKSPACE: WORKSPACE_API.Workspace, SERVICE_CONFIG: API.EnvironmentRegistryConfig) => {
  return new Promise(async (resolve) => {
    const { serviceName } = SERVICE_CONFIG;

    const registerServiceData = {
      serviceName,
      reference: utils.getServiceInstance(SERVICE_CONFIG),
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
