import { EnvRegistry } from '@capsulajs/environment-registry';
import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import * as API from './api';

declare let publicExports: object;

const bootstrap = (WORKSPACE: WORKSPACE_API.Workspace, SERVICE_CONFIG: API.EnvironmentRegistryConfig) => {
  return new Promise(async (resolve) => {
    const { token } = SERVICE_CONFIG;
    const envRegistryService = new EnvRegistry(token);

    const registerServiceData = {
      serviceName: 'EnvironmentRegistryService',
      reference: envRegistryService,
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
