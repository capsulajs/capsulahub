import { Dispatcher } from '@capsulajs/capsulajs-transport-providers';
import Provider from './Provider';

export default interface ConfigurationConfig {
  token: string;
  provider?: Provider;
  dispatcher?: Dispatcher;
}
