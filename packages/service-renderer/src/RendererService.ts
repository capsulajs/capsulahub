import { API } from '@capsulajs/capsulahub-workspace';
import { Renderer, RenderItemRequest } from './api';
import { callRenderLayoutsBefore, invalidNodeId, notFoundComponent, notFoundNode } from './helpers/const';

export default (WORKSPACE: API.Workspace) => {
  return new Promise(async (resolve) => {
    class RendererService implements Renderer {
      private renderedLayouts: boolean = false;

      public async renderLayouts() {
        this.renderedLayouts = true;

        (await this.components('layout')).forEach((component: API.Component) => {
          this.renderComponent(component);
        });
      }

      public async renderItems() {
        if (!this.renderedLayouts) {
          throw new Error(callRenderLayoutsBefore);
        }

        (await this.components('item')).forEach((component: API.Component) => {
          this.renderComponent(component);
        });
      }

      public async renderItem(renderItemRequest: RenderItemRequest) {
        if (typeof renderItemRequest.nodeId !== 'string') {
          throw new Error(invalidNodeId);
        }

        const component = (await this.components()).find((c: API.Component) => c.nodeId === renderItemRequest.nodeId);
        if (!component) {
          throw new Error(notFoundComponent);
        }

        this.renderComponent(component);
      }

      private renderComponent(component: API.Component) {
        const node = document && document.getElementById(component.nodeId);
        if (!node) {
          throw new Error(notFoundNode);
        }
        node.innerHTML = '';
        node.appendChild(component.reference);
      }

      private async components(type?: API.ComponentType) {
        const componentsMap = await WORKSPACE.components({});
        const components = await Promise.all(Object.keys(componentsMap).map((key) => componentsMap[key]));
        return type ? components.filter((component: API.Component) => component.type === type) : components;
      }
    }

    const rendererService = new RendererService();

    WORKSPACE.registerService({
      serviceName: 'RendererService',
      reference: rendererService,
    }).then(async () => {
      // @ts-ignore
      if (!window.mockComponents && process.env.NODE_ENV !== 'test') {
        await rendererService.renderLayouts();
        await rendererService.renderItems();
      }
    });

    resolve();
  });
};
