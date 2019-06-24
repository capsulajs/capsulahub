import WorkspaceFactory from '@capsulajs/capsulahub-workspace';
import { filter } from 'lodash';

filter([1, 2, 3], () => true);

new WorkspaceFactory()
  .createWorkspace({
    token: `http://localhost:3000/configuration`,
    configProvider: 'httpFile',
  })
  .then((workspace) => {
    console.info('Workspace has been created', workspace);
  })
  .catch((error) => {
    console.info('error while creating a Workspace', error);
  });
