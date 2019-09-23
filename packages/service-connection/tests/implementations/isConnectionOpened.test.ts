import { mockIsConnectionOpenedResponse, mockConfig } from '../helpers/wsMock';
import { Connection as ConnectionInterface } from '../../src/api';
import { defaultRequests, providers } from '../consts';
import { messages, wsReadyStates } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';

describe.each(providers)('ConnectionService (%s) close method test suite', (provider) => {
  let connection: ConnectionInterface;
  const { envKey, endpoint } = defaultRequests[provider];

  beforeEach(() => {
    switch (provider) {
      case 'websocket':
        connection = new WebSocketConnection();
        break;
      case 'rsocket':
        // connection = new RSocketConnection();
        break;
      default:
        return new Error(messages.noProvider);
    }
  });

  it('Call isConnectionOpened method when connection is established', async () => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    return expect(connection.isConnectionOpened({ envKey })).toBeTruthy();
  });

  it("Call isConnectionOpened method when there's no connection established", async () => {
    expect.assertions(1);
    return expect(connection.isConnectionOpened({ envKey })).toBeFalsy();
  });

  it('Call isConnectionOpened method when connection is pending', async () => {
    expect.assertions(1);
    mockConfig(true);
    mockIsConnectionOpenedResponse(wsReadyStates.connecting);
    return expect(connection.isConnectionOpened({ envKey })).toBeFalsy();
  });

  const invalidRequests = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.each(invalidRequests)('Call isConnectionOpened with invalid request: %s', async (invalidRequest) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.isConnectionOpened(invalidRequest)).toBeFalsy();
  });
});
