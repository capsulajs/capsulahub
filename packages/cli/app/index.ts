import { API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';

new WorkspaceFactory()
  .createWorkspace({
    token: process.env.CAPSULAHUB_TOKEN!,
    configProvider: process.env.CAPSULAHUB_CONFIG_PROVIDER! as API.ConfigurationProvider,
  })
  .then((workspace) => {
    console.info('Workspace has been created', workspace);
  })
  .catch((error) => {
    console.info('error while creating a Workspace', error);
  });
