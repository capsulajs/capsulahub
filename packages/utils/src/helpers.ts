import * as TYPES from './types';

export default {
  prepareWebComponent({ bootstrap, mountId, name }: TYPES.PrepareWebComponentRequest) {
    return bootstrap().then((Component) => {
      customElements.define(name, Component);
      const customElement = new Component();
      document.getElementById(mountId)!.appendChild(customElement);
    });
  },
};
