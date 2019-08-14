import { MicroserviceApi } from '@scalecube/api';

export default interface ServiceConfig {
  serviceName: string;
  path?: string;
  definition: MicroserviceApi.ServiceDefinition;
  config: { [key: string]: any };
}
