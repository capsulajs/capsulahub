import { Provider } from '.';

export interface OrganizationServiceOptions {
  /**
   * The requested token issued by relevant authority (Auth0)
   */
  token: string;
  /**
   * Transport provider, that will be used for the establishment of communication with OrganizationService on server
   */
  provider: Provider;
  /**
   * The name of the service, that will be used in Capsulahub
   */
  serviceName: string;
}
