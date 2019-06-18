export const prepareComponent = (bootstrap: () => Promise<new () => HTMLElement>, name: string, mountId: string) => {
  return bootstrap().then((Component) => {
    customElements.define(name, Component);
    const layoutElement = new Component();
    document.getElementById(mountId)!.appendChild(layoutElement);
  });
};
