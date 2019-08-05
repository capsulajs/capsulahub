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
  extensionsEventTypes,
} from './const';
import { ExtensionEventType } from './types';

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
        throw getErrorWithModifiedMessage(error, getBootstrapComponentError(error, componentData.componentName));
      })
    )
    .then((WebComponent) => {
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
            console.error(
              getErrorWithModifiedMessage(error, getBootstrapServiceError(error, serviceConfig.serviceName))
            );
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
  error.message = newMessage;
  return error;
};

export const generateMicroserviceAddress = (path: string) => ({
  host: 'host',
  port: 7777,
  protocol: 'pm',
  path,
});

export const generateServiceEventType = ({
  serviceName,
  type,
  id,
}: {
  serviceName: any;
  type: ExtensionEventType;
  id: string;
}) => {
  return `${
    typeof serviceName === 'string' ? serviceName.toUpperCase() : 'UNKNOWN_SERVICE'
  }_${type.toUpperCase()}_${id}`;
};

export const generateComponentEventType = ({
  nodeId,
  type,
  id,
}: {
  nodeId: string;
  type: ExtensionEventType;
  id: string;
}) => {
  return `COMPONENT_FOR_${nodeId.toUpperCase()}_${type.toUpperCase()}_${id}`;
};

export const emitServiceRegistrationSuccessEvent = ({ serviceName, id }: { serviceName: string; id: string }) => {
  document.dispatchEvent(
    new CustomEvent(generateServiceEventType({ serviceName, type: extensionsEventTypes.registered, id }))
  );
};

export const emitServiceRegistrationFailedEvent = ({
  serviceName,
  error,
  id,
}: {
  serviceName: string;
  error: string;
  id: string;
}) => {
  document.dispatchEvent(
    new CustomEvent(generateServiceEventType({ serviceName, type: extensionsEventTypes.registrationFailed, id }), {
      detail: error,
    })
  );
};

export const emitComponentRegistrationSuccessEvent = ({ nodeId, id }: { nodeId: string; id: string }) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ nodeId, type: extensionsEventTypes.registered, id }))
  );
};

export const emitComponentRegistrationFailedEvent = ({
  nodeId,
  error,
  id,
}: {
  nodeId: string;
  error: string;
  id: string;
}) => {
  document.dispatchEvent(
    new CustomEvent(generateComponentEventType({ nodeId, type: extensionsEventTypes.registrationFailed, id }), {
      detail: error,
    })
  );
};
