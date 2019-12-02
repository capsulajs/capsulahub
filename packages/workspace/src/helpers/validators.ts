import { configurationTypes } from '@capsulajs/capsulajs-configuration-service';
import { API } from '..';
import {
  createWorkspaceWrongRequestError,
  createWorkspaceWrongRequestForScalecubeProviderError,
  createWorkspaceWrongRequestRepositoryError,
} from './const';

export const validateWorkspaceConfig = (workspaceConfig: any): boolean => {
  const requiredKeys = ['name', 'services', 'components'];
  const configKeys = Object.keys(workspaceConfig);
  return !requiredKeys.find((requiredKey) => !configKeys.includes(requiredKey));
};

export const validateCreateWorkspaceRequest = (createWorkspaceRequest: any): boolean | never => {
  if (
    !createWorkspaceRequest ||
    typeof createWorkspaceRequest !== 'object' ||
    !createWorkspaceRequest.token ||
    typeof createWorkspaceRequest.token !== 'string' ||
    !createWorkspaceRequest.token.trim()
  ) {
    throw new Error(createWorkspaceWrongRequestError);
  }

  const { configProvider, dispatcherUrl, repository } = createWorkspaceRequest;
  if (configProvider === configurationTypes.scalecube) {
    if (!dispatcherUrl || typeof dispatcherUrl !== 'string' || !dispatcherUrl.trim()) {
      throw new Error(createWorkspaceWrongRequestForScalecubeProviderError);
    }
  }

  if (typeof repository !== 'undefined' && (typeof repository !== 'string' || !repository.trim())) {
    throw new Error(createWorkspaceWrongRequestRepositoryError);
  }

  return true;
};

export const validateRegisterServiceRequest = (registerServiceRequest: any): boolean => {
  return !(
    !registerServiceRequest.serviceName ||
    typeof registerServiceRequest.serviceName !== 'string' ||
    !registerServiceRequest.serviceName.trim() ||
    !registerServiceRequest.reference ||
    typeof registerServiceRequest.reference !== 'object'
  );
};

export const validateServiceInConfig = (
  workspaceConfig: API.WorkspaceConfig,
  registerServiceRequest: API.RegisterServiceRequest
): boolean => {
  return !!workspaceConfig.services.find((service) => service.serviceName === registerServiceRequest.serviceName);
};

export const validateComponentInConfig = (
  workspaceConfig: API.WorkspaceConfig,
  registerComponentRequest: API.Component
): boolean => {
  return !!workspaceConfig.components[registerComponentRequest.type === 'layout' ? 'layouts' : 'items'][
    registerComponentRequest.nodeId
  ];
};
