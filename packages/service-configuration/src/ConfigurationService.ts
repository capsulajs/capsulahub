import { API } from '@capsulajs/capsulahub-workspace';
import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service';
import {
  ConfigurationServiceScalecube,
  ConfigurationServiceLocalStorage,
  ConfigurationServiceFile,
  ConfigurationServiceHttp,
} from '@capsulajs/capsulajs-configuration-service';
import { ConfigurationConfig } from './api';

export default (workspace: API.Workspace, serviceConfig: ConfigurationConfig) => {
  return new Promise((resolve) => {
    const { token, provider, dispatcher } = serviceConfig;

    let configurationService: ConfigurationService;

    switch (provider) {
      case 'remote':
        configurationService = new ConfigurationServiceScalecube(token, dispatcher!);
        break;
      case 'local':
        configurationService = new ConfigurationServiceLocalStorage(token);
        break;
      case 'file':
        configurationService = new ConfigurationServiceFile(token);
        break;
      case 'http':
        configurationService = new ConfigurationServiceHttp(token);
        break;
      default:
        configurationService = new ConfigurationServiceFile(token);
    }

    workspace.registerService({
      serviceName: 'ConfigurationService',
      reference: configurationService,
    });

    resolve();
  });
};
