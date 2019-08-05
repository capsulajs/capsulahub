import { ServicesMap, ServicesRequest, RegisterServiceRequest, ComponentsMap, ComponentsRequest } from './index';

/**
 * Workspace is the core service of Capsula Hub, it is responsible for :
 * - Allowing services to register themselves (REGISTER)
 * - Letting services and components communicate together (SERVICES/COMPONENTS)
 * - Getting their own configuration (CONFIG)
 * Workspace need to be instantiated with a configuration service
 */
export default interface Workspace {
  readonly id: string;

  /**
   * Getting a map of promises to each service that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * @param servicesRequest
   */
  services(servicesRequest: ServicesRequest): Promise<ServicesMap>;

  /**
   * Getting a map of promises to each component that has been loaded in the workspace
   * Reject in case :
   * - Invalid request
   * @param componentsRequest
   */
  components(componentsRequest: ComponentsRequest): Promise<ComponentsMap>;

  /**
   * Register a service in the workspace.
   * Reject in case :
   * - Invalid request
   * - Service specified in request doesn't exist in workspace configuration
   * - Service specified in request already registered
   * @param registerServiceRequest
   */
  registerService(registerServiceRequest: RegisterServiceRequest): Promise<void>;
}
