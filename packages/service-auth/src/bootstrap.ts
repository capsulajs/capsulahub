import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import { API } from '.';
import { Auth } from './AuthService';

export default (workspace: WORKSPACE_API.Workspace, serviceConfig: API.AuthServiceConfig) => {
  return new Promise((resolve) => {
    const authService = new Auth({
      domain: serviceConfig.domain,
      clientId: serviceConfig.clientId,
      lockOptions: serviceConfig.lockOptions,
    });

    workspace.registerService({
      serviceName: serviceConfig.serviceName,
      reference: authService,
    });

    return resolve();
  });
};
