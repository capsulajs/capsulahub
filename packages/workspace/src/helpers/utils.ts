import { ConfigurationService, API as CONFIGURATION_SERVICE_API } from '@capsulajs/capsulajs-configuration-service';
import { AxiosDispatcher } from '@capsulajs/capsulajs-transport-providers';
import { API } from '..';
import * as INTERNAL_TYPES from './types';
import {
  getLoadingServiceError,
  getLoadingComponentError,
  getBootstrapServiceError,
  getBootstrapComponentError,
  getInitComponentError,
} from './const';

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
    const errorMessage = type === 'service' ? getLoadingServiceError(itemName) : getLoadingComponentError(itemName);
    console.error(errorMessage, error);
  });

export const initComponent = (componentName: string, WebComponent: INTERNAL_TYPES.CustomWebComponentClass) => {
  customElements.define(componentName, WebComponent);
  return new WebComponent();
};

export const bootstrapComponent = (
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
    .then((bootstrap) => {
      if (bootstrap) {
        const errorMessage = getBootstrapComponentError(componentData.componentName);
        try {
          return bootstrap(workspace, componentData.config).catch((error) => {
            console.error(errorMessage, error);
          });
        } catch (error) {
          console.error(errorMessage, error);
        }
      }
    })
    .then((WebComponent) => {
      if (WebComponent) {
        let webComponent;
        try {
          webComponent = initComponent(componentData.componentName, WebComponent);
        } catch (error) {
          console.error(getInitComponentError(componentData.componentName), error);
        }
        webComponent &&
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
    servicesConfig.reduce(
      (promises, serviceConfig) => {
        if (!serviceConfig.path) {
          return [...promises];
        }
        const promise = getModuleDynamically<void>(serviceConfig.path, 'service', serviceConfig.serviceName).then(
          (bootstrap) => {
            if (bootstrap) {
              const errorMessage = getBootstrapServiceError(serviceConfig.serviceName);
              try {
                return bootstrap(workspace, serviceConfig.config).catch((error) => {
                  console.error(errorMessage, error);
                });
              } catch (error) {
                console.error(errorMessage, error);
              }
            }
          }
        );
        return [...promises, promise];
      },
      [] as Array<Promise<void>>
    )
  );
};

export const bootstrapComponents = (
  workspace: INTERNAL_TYPES.Workspace,
  componentsConfig: INTERNAL_TYPES.ComponentsConfig,
  type: API.ComponentType
) => {
  return Promise.all(
    Object.keys(componentsConfig).map((nodeId: string) => bootstrapComponent(nodeId, componentsConfig, workspace, type))
  );
};

export const getErrorWithModifiedMessage = (error: Error, newMessage: string): Error => {
  const newError = new Error(newMessage);
  newError.stack = error.stack;
  return newError;
};

export const generateMicroserviceAddress = (path: string) => ({
  host: 'host',
  port: 7777,
  protocol: 'pm',
  path,
});
