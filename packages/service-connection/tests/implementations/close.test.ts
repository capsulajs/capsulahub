import { Connection as ConnectionInterface, ConnectionEvent } from '../../src/api';
import { defaultRequests, providers } from '../consts';
import { eventTypes, messages } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';

describe.each(providers)('ConnectionService (%s) close method test suite', (provider) => {
  let connection: ConnectionInterface;
  const { envKey, endpoint } = defaultRequests[provider];

  beforeEach(() => {
    switch (provider) {
      case 'websocket':
        connection = new WebSocketConnection();
        break;
      case 'rsocket':
        connection = new RSocketConnection();
        break;
      default:
        return new Error(messages.noProvider);
    }
  });

  it('Calling close with a valid request', async (done) => {
    expect.assertions(5);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          done();
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    return expect(connection.close({ envKey })).resolves.toEqual(undefined);
  });

  const invalidRequests = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.each(invalidRequests)('Calling close with an invalid request: %s', async (invalidRequest) => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    // @ts-ignore
    return expect(connection.close({ invalidRequest })).rejects.toEqual(new Error(messages.invalidRequest));
  });

  it('Calling close when no connection has been currently established', () => {
    expect.assertions(1);
    return expect(connection.close({ envKey })).rejects.toEqual(new Error(messages.noConnection(envKey)));
  });

  it('Calling close when there is a "pending closing of connection"', async (done) => {
    expect.assertions(6);
    let count = 0;
    connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          done();
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    connection.close({ envKey }).then((response) => expect(response).toEqual(undefined));
    return expect(connection.close({ envKey })).rejects.toEqual(new Error(messages.pendingDisconnection(envKey)));
  });
});
