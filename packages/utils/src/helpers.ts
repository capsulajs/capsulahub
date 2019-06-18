import * as TYPES from './types';

export default {
  prepareComponent({ bootstrap, mountId, name }: TYPES.PrepareComponentRequest) {
    return bootstrap().then((Component) => {
      customElements.define(name, Component);
      const customElement = new Component();
      document.getElementById(mountId)!.appendChild(customElement);
    });
  },
};
