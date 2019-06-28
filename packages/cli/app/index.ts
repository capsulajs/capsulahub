import { API as CONFIGURATION_SERVICE_API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';
import * as API from '../src/helpers/types';

const appConfig: API.AppConfig = require('../bin/temp/app-config.json');
const config = appConfig[window.location.port];

new WorkspaceFactory()
  .createWorkspace({
    token: process.env.CAPSULAHUB_TOKEN || config.token,
    configProvider:
      (process.env.CAPSULAHUB_CONFIG_PROVIDER as CONFIGURATION_SERVICE_API.ConfigurationProvider) ||
      config.configProvider,
    dispatcherUrl: process.env.CAPSULAHUB_DISPATCHER_URL || config.dispatcherUrl,
  })
  .catch((error: Error) => {
    console.info('error while creating a Workspace', error);
  });
