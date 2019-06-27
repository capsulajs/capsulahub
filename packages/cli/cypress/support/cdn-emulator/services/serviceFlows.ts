import { of } from 'rxjs';
import { API } from '@capsulajs/capsulahub-workspace';

declare var publicExports: object;

const bootstrap = (WORKSPACE: API.Workspace, config: { componentName: string }) => {
  return new Promise((resolve) => {
    class ServiceFlows {
      constructor() {
        const componentReferencePromise = WORKSPACE.components({})
          .then((components) => components[config.componentName])
          .then((component) => component.reference);

        const serviceAMessagePromise = WORKSPACE.services({})
          .then((services) => services.ServiceA)
          .then((service) => service.proxy.getMessage());

        Promise.all([componentReferencePromise, serviceAMessagePromise]).then(
          ([componentReference, serviceAMessage]) => {
            // @ts-ignore
            componentReference.setProps!(of({ message: serviceAMessage }));
          }
        );
      }
    }

    new ServiceFlows();

    resolve();
  });
};

if (typeof publicExports !== 'undefined') {
  publicExports = bootstrap;
}

export default bootstrap;
