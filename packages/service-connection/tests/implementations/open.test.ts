import { defaultRequests, eventTypes, providers } from '../consts';
import { Connection as ConnectionInterface, ConnectionEvent } from '../../src/api';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import { messages } from '../../src/consts';

describe.each(providers)('ConnectionService (%s) open method test suite', (provider) => {
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

  it('Calling open with a valid request', async (done) => {
    expect.assertions(3);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      switch (count) {
        case 0:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 1:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          done();
          break;
      }
      count = count + 1;
    });
    connection.open({ envKey, endpoint }).then(() => expect(connection.isConnectionOpened({ envKey })).toBeTruthy());
  });

  const invalidValues = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.only.each(invalidValues)('Calling open with an invalid envKey: %s', async (invalidEnvKey) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey: invalidEnvKey, endpoint })).rejects.toBe(
      new Error(messages.invalidRequest)
    );
  });

  it.each(invalidValues)('Calling open with an invalid endpoint: %s', async (invalidEndPoint) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey, endpoint: invalidEndPoint })).rejects.toBe(
      new Error(messages.invalidRequest)
    );
  });

  it('Calling open with a valid request and an error while establishing the connection occurs', async () => {
    expect.assertions(4);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      switch (count) {
        case 0:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 1:
          expect(event.type).toBe(eventTypes.error);
          break;
      }
      count = count + 1;
    });
    connection.open({ envKey, endpoint }).catch((error) => {
      expect(connection.isConnectionOpened({ envKey })).toBeFalsy();
      expect(error).toBe(new Error(messages.connectionError));
    });
  });

  it('Calling open when there is a "pending connection"', async () => {
    expect.assertions(4);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      if (event.type === eventTypes.connectionStarted) {
        return expect(connection.open({ envKey, endpoint })).rejects.toBe(
          new Error(messages.pendingConnection(envKey))
        );
      }
      switch (count) {
        case 0:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 1:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
      }
      count = count + 1;
    });
    connection.open({ envKey, endpoint }).then(() => expect(connection.isConnectionOpened({ envKey })).toBeTruthy());
  });

  it('Calling open when connection is already established for `envKey`', async () => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    await expect(connection.open({ envKey, endpoint })).rejects.toBe(new Error(messages.alreadyConnected(envKey)));
    return expect(connection.isConnectionOpened({ envKey })).toBeTruthy();
  });
});
