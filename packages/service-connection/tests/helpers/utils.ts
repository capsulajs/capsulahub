import { providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';
import { Provider } from '../../src/api';

export const getConnectionProvider = (provider: Provider) => {
  switch (provider) {
    case providers.websocket:
      return new WebSocketConnection();
    case providers.rsocket:
      return new RSocketConnection();
  }
};
