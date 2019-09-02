import { API } from '@capsulajs/capsulajs-configuration-service';

export interface AppConfigItem {
  token: string;
  configProvider: API.ConfigurationProvider;
  dispatcherUrl?: string;
  repository?: string;
}

export interface AppConfig {
  [port: string]: AppConfigItem;
}

export interface Arguments {
  token: string;
  configProvider?: API.ConfigurationProvider;
  port?: number;
  output?: string;
  dispatcherUrl?: string;
}
