import { defaultRequests, eventTypes, providers, rsocketModels } from '../consts';
import { Connection as ConnectionInterface, ConnectionEvent, SendMessageRequest } from '../../src/api';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import { messages } from '../../src/consts';

describe.each(providers)('ConnectionService (%s) close method test suite', (provider) => {
  let connection: ConnectionInterface;
  const { envKey, endpoint, data } = defaultRequests[provider];

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

  it(`Calling send with a valid request (${provider})`, async () => {
    expect.assertions(4);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      switch (count) {
        case 0:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 1:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.messageReceived);
          break;
      }
      count = count + 1;
    });
    await connection.open({ envKey, endpoint });
    if (provider === 'rsocket') {
      return expect(connection.send({ envKey, model: rsocketModels.response, data } as SendMessageRequest)).resolves;
    }
    if (provider === 'websocket') {
      return expect(connection.send({ envKey, data })).resolves;
    }
  });

  it(`Calling send without providing model (${provider})`, async () => {
    if (provider !== 'rsocket') {
      return true;
    }
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    return expect(connection.send({ envKey, data })).rejects.toBe(new Error(messages.modelRequired));
  });

  it('Calling send when the connection is in "pending" state', async () => {
    expect.assertions(5);
    let request = {};
    let count = 0;

    if (provider === 'rsocket') {
      request = { envKey, model: rsocketModels.response, data };
    }
    if (provider === 'websocket') {
      request = { envKey, data };
    }

    connection.events$({}).subscribe((event: ConnectionEvent) => {
      if (event.type === eventTypes.connectionStarted) {
        return expect(connection.send(request as SendMessageRequest)).resolves;
      }
      switch (count) {
        case 0:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 1:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.messageSent);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageReceived);
          break;
      }
      count = count + 1;
    });
    await connection.open({ envKey, endpoint });
  });

  const invalidValues = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.each(invalidValues)('Calling send with a invalid envKey', async (invalidEnvKey) => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    let invalidRequest = {};
    if (provider === 'rsocket') {
      invalidRequest = { envKey: invalidEnvKey, model: rsocketModels.response, data };
    }
    if (provider === 'websocket') {
      invalidRequest = { envKey: invalidEnvKey, data };
    }
    // @ts-ignore
    return expect(connection.send(invalidRequest)).rejects.toBe(new Error(messages.invalidRequest));
  });

  it.each(invalidValues)(`Calling send with a invalid model (${provider})`, async (invalidModel) => {
    if (provider !== 'rsocket') {
      return true;
    }
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.send({ envKey, model: invalidModel, data })).rejects.toBe(
      new Error(messages.invalidRequest)
    );
  });

  it('Calling send when there is no open connection and "pending" state of connection', async () => {
    expect.assertions(2);
    let request = {};
    if (provider === 'rsocket') {
      request = { envKey, model: rsocketModels.response, data };
    }
    if (provider === 'websocket') {
      request = { envKey, data };
    }
    expect(connection.isConnectionOpened({ envKey })).toBeFalsy();
    return expect(connection.send(request as SendMessageRequest)).rejects.toBe(new Error(messages.invalidRequest));
  });

  it('Calling send when "pending" state of connection failed', async () => {
    expect.assertions(3);
    let request = {};
    let count = 0;

    if (provider === 'rsocket') {
      request = { envKey, model: rsocketModels.response, data };
    }
    if (provider === 'websocket') {
      request = { envKey, data };
    }

    connection.events$({}).subscribe((event: ConnectionEvent) => {
      if (event.type === eventTypes.connectionStarted) {
        return expect(connection.send(request as SendMessageRequest)).rejects.toBe(new Error(messages.connectionError));
      }
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
    await connection.open({ envKey, endpoint });
  });

  it('Calling send when "pending closing of connection" exists', async () => {
    expect.assertions(3);
    let request = {};

    if (provider === 'rsocket') {
      request = { envKey, model: rsocketModels.response, data };
    }
    if (provider === 'websocket') {
      request = { envKey, data };
    }

    connection.events$({}).subscribe((event: ConnectionEvent) => {
      if (event.type === eventTypes.disconnectionStarted) {
        return expect(connection.send(request as SendMessageRequest)).rejects.toBe(
          new Error(messages.noConnection(envKey))
        );
      }
    });
    await connection.open({ envKey, endpoint });
    await connection.close({ envKey });
  });
});
