import { ConfigurationService, API as CONFIGURATION_SERVICE_API } from '@capsulajs/capsulajs-configuration-service';
import { AxiosDispatcher } from '@capsulajs/capsulajs-transport-providers';
import { API } from '..';
import * as INTERNAL_TYPES from './types';
import {
  getLoadingServiceError,
  getLoadingComponentError,
  getBootstrapServiceError,
  getInitComponentError,
  getBootstrapComponentError,
} from './const';
import { emitComponentRegistrationFailedEvent, emitServiceRegistrationFailedEvent } from './eventEmitters';

export const getConfigurationService = (
  token: string,
  ConfigurationServiceClass: CONFIGURATION_SERVICE_API.ConfigurationProviderClass,
  dispatcherUrl?: string
): ConfigurationService<API.WorkspaceConfig> => {
  const args: Array<string | AxiosDispatcher> = [token];
  if (dispatcherUrl) {
    args.push(new AxiosDispatcher(dispatcherUrl));
  }

  return new ConfigurationServiceClass(...args);
};

export const dynamicImport = (path: string) => import(path).then((module) => module.default);

export const getModuleDynamically = <BootstrapResponse>(
  path: string,
  type: 'service' | 'component',
  itemName: string
): Promise<API.ModuleBootstrap<BootstrapResponse>> =>
  dynamicImport(path).catch((error) => {
    if (type === 'service') {
      throw getErrorWithModifiedMessage(error, getLoadingServiceError(error, itemName));
    } else {
      throw getErrorWithModifiedMessage(error, getLoadingComponentError(error, itemName));
    }
  });

export const bootstrapComponent = (componentName: string, WebComponent: INTERNAL_TYPES.CustomWebComponentClass) => {
  customElements.define(componentName, WebComponent);
  return new WebComponent();
};

export const initComponent = (
  nodeId: string,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  workspace: INTERNAL_TYPES.Workspace,
  type: API.ComponentType
): Promise<void> => {
  const componentData = componentsConfig[nodeId];

  return getModuleDynamically<INTERNAL_TYPES.CustomWebComponentClass>(
    componentData.path,
    'component',
    componentData.componentName
  )
    .then((bootstrap) =>
      bootstrap(workspace, componentData.config).catch((error) => {
        const errorMessage = getBootstrapComponentError(error, componentData.componentName);
        console.error(getErrorWithModifiedMessage(error, errorMessage));
        emitComponentRegistrationFailedEvent({
          // TODO nodeId or componentName?
          nodeId: componentData.componentName,
          error: errorMessage,
          id: workspace.id,
        });
      })
    )
    .then((WebComponent) => {
      if (WebComponent) {
        let webComponent;
        try {
          webComponent = bootstrapComponent(componentData.componentName, WebComponent);
        } catch (error) {
          throw getErrorWithModifiedMessage(error, getInitComponentError(error, componentData.componentName));
        }
        workspace.registerComponent({
          nodeId,
          type,
          componentName: componentData.componentName,
          reference: webComponent,
        });
      }
    });
};

export const bootstrapServices = (workspace: API.Workspace, servicesConfig: API.ServiceConfig[]): Promise<any[]> => {
  return Promise.all(
    servicesConfig.map((serviceConfig) => {
      return getModuleDynamically<void>(serviceConfig.path, 'service', serviceConfig.serviceName).then(
        async (bootstrap) => {
          try {
            await bootstrap(workspace, serviceConfig.config);
          } catch (error) {
            const errorMessage = getBootstrapServiceError(error, serviceConfig.serviceName);
            console.error(getErrorWithModifiedMessage(error, errorMessage));
            emitServiceRegistrationFailedEvent({
              serviceName: serviceConfig.serviceName,
              error: errorMessage,
              id: workspace.id,
            });
          }
        }
      );
    })
  );
};

export const initComponents = (
  workspace: INTERNAL_TYPES.Workspace,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  type: API.ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => initComponent(nodeId, componentsConfig, workspace, type))
  );
};

export const getErrorWithModifiedMessage = (error: Error, newMessage: string): Error => {
  return { ...error, message: newMessage };
};

export const generateMicroserviceAddress = (path: string) => ({
  host: 'host',
  port: 7777,
  protocol: 'pm',
  path,
});
