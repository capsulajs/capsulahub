import { API } from '@capsulajs/capsulajs-configuration-service';

export interface AppConfigItem {
  token: string;
  configProvider: API.ConfigurationProvider;
  dispatcherUrl?: string;
}

export interface AppConfig {
  [port: string]: AppConfigItem;
}
