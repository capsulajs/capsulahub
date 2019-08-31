import { API } from '@capsulajs/capsulajs-configuration-service';

export default interface CreateWorkspaceRequest {
  /** Token used to get workspace configuration */
  token: string;
  /**
   * The type of configuration provider, that will be used to get configuration
   * Possible values: "localFile","httpFile","scalecube","httpServer","localStorage"
   * @default "httpFile"
   */
  configProvider?: API.ConfigurationProvider;
  /**
   * The name of the repository, where workspace configuration has been placed
   * @default "workspace"
   */
  repository?: string;
  /**
   * Dispatcher url, that will be used in "scalecube" config provider
   */
  dispatcherUrl?: string;
}
