import { API as CONFIGURATION_SERVICE_API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';
import * as API from '../src/helpers/types';

const appConfig: API.AppConfig = require('../capsulahub.json');
const config = appConfig[window.location.port];

new WorkspaceFactory()
  .createWorkspace({
    token: process.env.CAPSULAHUB_TOKEN || config.token,
    configProvider:
      (process.env.CAPSULAHUB_CONFIG_PROVIDER as CONFIGURATION_SERVICE_API.ConfigurationProvider) ||
      config.configProvider,
  })
  .catch((error) => {
    console.info('error while creating a Workspace', error);
  });
