import { EnvRegistry } from '@capsulajs/environment-registry';
import * as API from '../api';

export default {
  getServiceInstance(config: API.EnvironmentRegistryConfig) {
    return new EnvRegistry({ token: config.token });
  },
};
