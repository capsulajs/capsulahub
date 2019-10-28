import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import { API } from '.';

export default (workspace: WORKSPACE_API.Workspace, serviceConfig: API.AuthServiceConfig) => {
  return new Promise((resolve) => {
    const authService = {};

    workspace.registerService({
      serviceName: serviceConfig.serviceName,
      reference: authService,
    });

    return resolve();
  });
};
