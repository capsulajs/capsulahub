import uuidv4 from 'uuid/v4';
import { Api as SCALECUBE_API, Microservices } from '@scalecube/scalecube-microservice';
import { API } from '.';
import * as INTERNAL_TYPES from './helpers/types';
import {
  componentAlreadyRegisteredError,
  componentsRequestInvalidError,
  componentToRegisterMissingInConfigurationError,
  extensionsEventTypes,
  getScalecubeCreationError,
  invalidRegisterServiceRequestError,
  serviceAlreadyRegisteredError,
  servicesRequestInvalidError,
  serviceToRegisterMissingInConfigurationError,
} from './helpers/const';
import {
  validateComponentInConfig,
  validateRegisterServiceRequest,
  validateServiceInConfig,
} from './helpers/validators';
import {
  generateMicroserviceAddress,
  generateServiceEventType,
  generateComponentEventType,
  emitServiceRegistrationFailedEvent,
  emitServiceRegistrationSuccessEvent,
  emitComponentRegistrationSuccessEvent,
  emitComponentRegistrationFailedEvent,
} from './helpers/utils';
import { ExtensionEventType } from './helpers/types';

export class Workspace implements API.Workspace {
  public readonly id: string;
  private configuration: API.WorkspaceConfig;
  private serviceRegistry: INTERNAL_TYPES.ServiceRegistry;
  private componentRegistry: INTERNAL_TYPES.ComponentRegistry;
  private microservice?: SCALECUBE_API.Microservice;
  private servicesMap: API.ServicesMap;
  private componentsMap: API.ComponentsMap;
  private listeners: INTERNAL_TYPES.EventListeners;
  private seedAddress?: string;

  constructor(configuration: API.WorkspaceConfig) {
    this.id = uuidv4();
    this.configuration = configuration;
    this.serviceRegistry = {} as INTERNAL_TYPES.ServiceRegistry;
    this.componentRegistry = {} as INTERNAL_TYPES.ComponentRegistry;
    this.listeners = {};
    this.servicesMap = this.createServiceMap();
    this.componentsMap = this.createComponentMap();
  }

  public services(servicesRequest: API.ServicesRequest): Promise<API.ServicesMap> {
    return new Promise((resolve, reject) => {
      if (!servicesRequest) {
        return reject(new Error(servicesRequestInvalidError));
      }
      return resolve(this.servicesMap);
    });
  }

  public components(componentsRequest: API.ComponentsRequest): Promise<API.ComponentsMap> {
    return new Promise((resolve, reject) => {
      if (!componentsRequest) {
        return reject(new Error(componentsRequestInvalidError));
      }
      return resolve(this.componentsMap);
    });
  }

  public registerService(registerServiceRequest: API.RegisterServiceRequest): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!validateRegisterServiceRequest(registerServiceRequest)) {
        emitServiceRegistrationFailedEvent({
          serviceName: registerServiceRequest.serviceName,
          error: invalidRegisterServiceRequestError,
          id: this.id,
        });
        return reject(new Error(invalidRegisterServiceRequestError));
      }

      if (!validateServiceInConfig(this.configuration, registerServiceRequest)) {
        emitServiceRegistrationFailedEvent({
          serviceName: registerServiceRequest.serviceName,
          error: serviceToRegisterMissingInConfigurationError,
          id: this.id,
        });
        return reject(new Error(serviceToRegisterMissingInConfigurationError));
      }

      const service = this.serviceRegistry[registerServiceRequest.serviceName];

      if (!!service) {
        emitServiceRegistrationFailedEvent({
          serviceName: registerServiceRequest.serviceName,
          error: serviceAlreadyRegisteredError,
          id: this.id,
        });
        return reject(new Error(serviceAlreadyRegisteredError));
      } else {
        const serviceConfig = this.configuration.services.find(
          (serviceConfiguration) => serviceConfiguration.serviceName === registerServiceRequest.serviceName
        );
        try {
          const microserviceOptions: SCALECUBE_API.MicroserviceOptions = {
            services: [{ definition: serviceConfig!.definition, reference: registerServiceRequest.reference }],
          };
          if (!this.seedAddress) {
            this.seedAddress = uuidv4();
            microserviceOptions.address = generateMicroserviceAddress(this.seedAddress);
          } else {
            microserviceOptions.address = generateMicroserviceAddress(uuidv4());
            microserviceOptions.seedAddress = generateMicroserviceAddress(this.seedAddress);
          }
          this.microservice = Microservices.create(microserviceOptions);
        } catch (error) {
          const errorMessage = getScalecubeCreationError(error, registerServiceRequest.serviceName);
          emitServiceRegistrationFailedEvent({
            serviceName: registerServiceRequest.serviceName,
            error: errorMessage,
            id: this.id,
          });
          return reject(new Error(errorMessage));
        }

        this.serviceRegistry[registerServiceRequest.serviceName] = { ...registerServiceRequest };
        emitServiceRegistrationSuccessEvent({ serviceName: registerServiceRequest.serviceName, id: this.id });
        return resolve();
      }
    });
  }

  public registerComponent(registerComponentRequest: API.Component): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!validateComponentInConfig(this.configuration, registerComponentRequest)) {
        reject(new Error(componentToRegisterMissingInConfigurationError));
      }
      const component = this.componentRegistry[registerComponentRequest.nodeId];

      if (!!component) {
        emitComponentRegistrationFailedEvent({
          nodeId: registerComponentRequest.nodeId,
          error: extensionsEventTypes.registrationFailed,
          id: this.id,
        });
        reject(new Error(componentAlreadyRegisteredError));
      } else {
        this.componentRegistry[registerComponentRequest.nodeId] = { ...registerComponentRequest };
        emitComponentRegistrationSuccessEvent({
          nodeId: registerComponentRequest.nodeId,
          id: this.id,
        });
        resolve();
      }
    });
  }

  public cleanEventListeners(): void {
    Object.keys(this.listeners).forEach((eventType) => {
      this.listeners[eventType].forEach((eventCallback) => document.removeEventListener(eventType, eventCallback));
    });
    this.listeners = {};
  }

  private createServiceMap() {
    return this.configuration.services.reduce((servicesMap, serviceConfig) => {
      const servicePromise = new Promise((resolve, reject) => {
        const observeEvent = (type: ExtensionEventType) => {
          const listenerHandler = (event: CustomEvent) =>
            type === extensionsEventTypes.registered
              ? resolve({
                  serviceName: serviceConfig.serviceName,
                  proxy: this.microservice!.createProxy({ serviceDefinition: serviceConfig.definition }),
                })
              : reject(new Error(event.detail));
          const eventType = generateServiceEventType({ serviceName: serviceConfig.serviceName, type, id: this.id });
          document.addEventListener(eventType, listenerHandler as EventListener, { once: true });
          this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler as EventListener);
        };
        Object.values(extensionsEventTypes).forEach(observeEvent);
      });
      return {
        ...servicesMap,
        [serviceConfig.serviceName]: servicePromise,
      };
    }, {});
  }

  private createComponentMap() {
    const componentsMap = { ...(this.componentsMap || {}) };
    const fulfillComponentsMap = (componentsConfig: { [nodeId: string]: API.ComponentConfig }) => {
      Object.keys(componentsConfig).forEach((nodeId) => {
        componentsMap[nodeId] = new Promise((resolve, reject) => {
          const observeEvent = (type: ExtensionEventType) => {
            const listenerHandler = (event: CustomEvent) =>
              type === extensionsEventTypes.registered
                ? resolve(this.componentRegistry[nodeId])
                : reject(new Error(event.detail));

            const eventType = generateComponentEventType({ nodeId, type, id: this.id });
            document.addEventListener(eventType, listenerHandler as EventListener, { once: true });
            this.listeners[eventType] = (this.listeners[eventType] || []).concat(listenerHandler as EventListener);
          };

          Object.values(extensionsEventTypes).forEach(observeEvent);
        });
      });
    };

    Object.values(this.configuration.components).forEach(fulfillComponentsMap);

    return componentsMap;
  }
}
