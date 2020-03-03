import { providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';
import { API } from '../../src';
import { ConnectionOptions } from '../../src/api/Connection';

export const getConnectionProvider = (provider: API.Provider, options?: ConnectionOptions) => {
  switch (provider) {
    case providers.websocket:
      return new WebSocketConnection(options);
    case providers.rsocket:
      return new RSocketConnection();
  }
};
