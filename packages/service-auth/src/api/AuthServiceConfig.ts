export interface AuthServiceConfig {
  domain: string;
  clientId: string;
  serviceName: string;
  lockOptions?: Auth0LockConstructorOptions;
}
