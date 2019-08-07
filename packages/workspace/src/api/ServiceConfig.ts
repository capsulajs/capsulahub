import { ServiceDefinition } from '@scalecube/scalecube-microservice/lib/api';

export default interface ServiceConfig {
  serviceName: string;
  path?: string;
  definition: ServiceDefinition;
  config: { [key: string]: any };
}
