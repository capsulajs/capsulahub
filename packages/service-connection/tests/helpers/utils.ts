import { providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';
import { API } from '../../src';

export const getConnectionProvider = (provider: API.Provider) => {
  switch (provider) {
    case providers.websocket:
      return new WebSocketConnection();
    case providers.rsocket:
      return new RSocketConnection();
  }
};
