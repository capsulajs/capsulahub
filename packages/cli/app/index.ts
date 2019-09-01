import { API as CONFIGURATION_SERVICE_API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';
import * as API from '../src/helpers/types';

const appConfig: API.AppConfig = require('../bin/app-config.json');
const config = appConfig[window.location.port];
let dispatcherUrl = process.env.CAPSULAHUB_DISPATCHER_URL || config.dispatcherUrl;
if (dispatcherUrl === 'undefined') {
  dispatcherUrl = undefined;
}
let repository = process.env.CAPSULAHUB_REPOSITORY || config.repository;
if (repository === 'undefined') {
  repository = undefined;
}

// config is applied for "run" command - configuration is stored for each port there
// process.env props are applied for "build" command and will be not available for "run"

new WorkspaceFactory()
  .createWorkspace({
    token: process.env.CAPSULAHUB_TOKEN || config.token,
    configProvider:
      (process.env.CAPSULAHUB_CONFIG_PROVIDER as CONFIGURATION_SERVICE_API.ConfigurationProvider) ||
      config.configProvider,
    repository,
    dispatcherUrl,
  })
  .catch((error: Error) => {
    console.info('error while creating a Workspace', error);
  });
