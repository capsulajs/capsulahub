import * as configurationServiceItems from '@capsulajs/capsulajs-configuration-service';
import { Entity } from '@capsulajs/capsulajs-configuration-service/lib/api/Entity';
import { API } from './';
import { Workspace } from './Workspace';
import {
  bootstrapServices,
  getConfigurationService,
  getErrorWithModifiedMessage,
  bootstrapComponents,
} from './helpers/utils';
import {
  configNotLoadedError,
  configRepositoryName,
  configWrongFormatError,
  createWorkspaceWrongRequestError,
  createWorkspaceWrongRequestForScalecubeProviderError,
} from './helpers/const';
import {
  validateCreateWorkspaceRequestScalecubeConfigProvider,
  validateCreateWorkspaceRequestToken,
  validateWorkspaceConfig,
} from './helpers/validators';

export default class WorkspaceFactory implements API.WorkspaceFactory {
  public createWorkspace(createWorkspaceRequest: API.CreateWorkspaceRequest): Promise<API.Workspace> {
    return new Promise((resolve, reject) => {
      // createWorkspaceRequest validation
      if (!validateCreateWorkspaceRequestToken(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestError));
      }
      if (!validateCreateWorkspaceRequestScalecubeConfigProvider(createWorkspaceRequest)) {
        return reject(new Error(createWorkspaceWrongRequestForScalecubeProviderError));
      }

      // Getting configurationService
      let configurationService: configurationServiceItems.ConfigurationService;
      try {
        configurationService = getConfigurationService(
          createWorkspaceRequest.token,
          configurationServiceItems.getProvider({
            configProvider:
              typeof createWorkspaceRequest.configProvider !== 'undefined'
                ? createWorkspaceRequest.configProvider
                : 'httpFile',
          }),
          createWorkspaceRequest.dispatcherUrl
        );
      } catch (error) {
        reject(getErrorWithModifiedMessage(error, configNotLoadedError(error)));
      }

      // Getting configuration and initializing Workspace

      return configurationService!
        .entries({ repository: configRepositoryName })
        .then((configuration: { entries: Entity[] }) => {
          // Preparing and validating formattedConfiguration
          const formattedConfiguration = configuration.entries.reduce(
            (acc: API.WorkspaceConfig, configEntity: Entity) => {
              return {
                ...acc,
                [configEntity.key]: configEntity.value,
              };
            },
            {} as API.WorkspaceConfig
          );
          if (!validateWorkspaceConfig(formattedConfiguration)) {
            return reject(new Error(configWrongFormatError));
          }

          const workspace = new Workspace(formattedConfiguration);
          return bootstrapServices(workspace, formattedConfiguration.services)
            .then(() => {
              return bootstrapComponents(workspace, formattedConfiguration.components.layouts, 'layout');
            })
            .then(() => {
              return bootstrapComponents(workspace, formattedConfiguration.components.items, 'item');
            })
            .then(() => {
              return resolve({
                services: workspace.services.bind(workspace),
                components: workspace.components.bind(workspace),
                registerService: workspace.registerService.bind(workspace),
              } as Workspace);
            })
            .catch((error) => {
              reject(error);
              workspace.cleanEventListeners();
            });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }
}
