import { API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';
// @ts-ignore
import appConfig from '../capsulahub.json';

const config = (appConfig as any)[window.location.port];

new WorkspaceFactory()
  .createWorkspace({
    token: (config as any).token,
    configProvider: (config as any).configProvider as API.ConfigurationProvider,
  })
  .then((workspace) => {
    console.info('Workspace has been created', workspace);
  })
  .catch((error) => {
    console.info('error while creating a Workspace', error);
  });
