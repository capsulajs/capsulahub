import { ConfigurationService } from '@capsulajs/capsulajs-configuration-service';

export interface WorkspaceConstructor {
  configurationService: ConfigurationService;
}
