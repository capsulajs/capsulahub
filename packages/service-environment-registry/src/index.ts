import { EnvRegistry } from '@capsulajs/environment-registry';
import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import * as API from './api';

declare let publicExports: object;

const bootstrap = (WORKSPACE: WORKSPACE_API.Workspace, SERVICE_CONFIG: API.EnvironmentRegistryConfig) => {
  return new Promise(async (resolve) => {
    const { token, serviceName } = SERVICE_CONFIG;

    const registerServiceData = {
      serviceName,
      reference: new EnvRegistry(token),
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
