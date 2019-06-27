import { API } from '@capsulajs/capsulahub-workspace';

declare var publicExports: object;

const bootstrap = (_: API.Workspace, config: { title: string; innerComponentId: string }) => {
  return new Promise((resolve) => {
    class Grid extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = `<div id="grid"><h1>Capsulahub title: ${config.title}</h1><div id="${
          config.innerComponentId
        }"></div></div>`;
      }
    }

    resolve(Grid);
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
