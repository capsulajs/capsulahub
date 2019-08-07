const bootstrap = () => {
  return new Promise((resolve) => {
    class RequestForm extends HTMLElement {
      constructor() {
        super();
        this.innerHTML = '<div id="request-form"><h1>Hello from request form</h1></div>';
      }
    }
    resolve(RequestForm);
  });
};

// @ts-ignore
if (typeof publicExports !== 'undefined') {
  // @ts-ignore
  publicExports = bootstrap;
}

export default bootstrap;
