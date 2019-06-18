import '@babel/polyfill';
import { API } from '../lib';

let workspace: API.Workspace;
// @ts-ignore
import('http://localhost:7777/dist/index.js')
  .then((module) => module.default)
  .then((WorkspaceFactory) => {
    const workspaceFactory = new WorkspaceFactory();
    return workspaceFactory.createWorkspace({ token: 'http://localhost:3000/configuration' });
  })
  .then((createdWorkspace) => {
    workspace = createdWorkspace;
  })
  .then(() => {
    document.getElementById('root')!.innerHTML = '<web-grid></web-grid><web-request-form></web-request-form>';
  })
  .then(() => {
    return workspace.services({});
  })
  .then((services) => {
    console.info('services', services);
    return services.ServiceA;
  })
  .then((serviceA) => {
    return serviceA.proxy.greet('Superuser');
  })
  .then((greeting) => {
    const serviceResEl = document.createElement('h2');
    serviceResEl.innerText = greeting;
    document.getElementById('request-form')!.appendChild(serviceResEl);
  })
  .catch((error) => console.info('Error in creating Workspace', error));
