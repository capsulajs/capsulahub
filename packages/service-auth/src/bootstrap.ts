import { API as WORKSPACE_API } from '@capsulajs/capsulahub-workspace';
import { API } from '.';
import { Auth } from './AuthService';
import { isNonEmptyString, isObject } from './helpers/validators';
import { errors } from './helpers/consts';

export default (workspace: WORKSPACE_API.Workspace, serviceConfig: API.AuthServiceConfig) => {
  return new Promise((resolve, reject) => {
    if (!isNonEmptyString(serviceConfig.domain)) {
      return reject(new Error(errors.invalidDomain));
    }
    if (!isNonEmptyString(serviceConfig.clientId)) {
      return reject(new Error(errors.invalidClientId));
    }
    if (!isNonEmptyString(serviceConfig.serviceName)) {
      return reject(new Error(errors.invalidServiceName));
    }
    if (typeof serviceConfig.lockOptions !== 'undefined' && !isObject(serviceConfig.lockOptions)) {
      return reject(new Error(errors.invalidLockOptions));
    }

    try {
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
    } catch (error) {
      return reject(error);
    }
  });
};
