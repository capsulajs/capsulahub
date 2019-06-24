import { API } from '@capsulajs/capsulajs-configuration-service';
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';

new WorkspaceFactory()
  .createWorkspace({
    token: process.env.TOKEN!,
    configProvider: process.env.CONFIG_PROVIDER! as API.ConfigurationProvider,
  })
  .then((workspace) => {
    console.info('Workspace has been created', workspace);
  })
  .catch((error) => {
    console.info('error while creating a Workspace', error);
  });
