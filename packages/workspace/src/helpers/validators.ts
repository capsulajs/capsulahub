import { API } from '..';

export const validateWorkspaceConfig = (workspaceConfig: any): boolean => {
  const requiredKeys = ['name', 'services', 'components'];
  const configKeys = Object.keys(workspaceConfig);
  return !requiredKeys.find((requiredKey) => !configKeys.includes(requiredKey));
};

export const validateCreateWorkspaceRequestToken = (createWorkspaceRequest: any): boolean => {
  return !(
    !createWorkspaceRequest.token ||
    typeof createWorkspaceRequest.token !== 'string' ||
    !createWorkspaceRequest.token.trim()
  );
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
