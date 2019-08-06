import WorkspaceFactory, { API } from '../';
// @ts-ignore
let workspace: API.Workspace;

const workspaceFactory = new WorkspaceFactory();
workspaceFactory
  .createWorkspace({ token: 'http://localhost:3000/configuration' })
  .then((createdWorkspace) => {
    workspace = createdWorkspace;
    // @ts-ignore
    window.workspace = createdWorkspace;
  })
  .catch((error) => console.info('Error in creating Workspace', error));
