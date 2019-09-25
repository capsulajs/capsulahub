import { Connection as ConnectionInterface, ConnectionEvent, Provider } from '../../src/api';
import { defaultRequests } from '../helpers/consts';
import { eventTypes, messages, providers } from '../../src/consts';
import { getConnectionProvider } from '../helpers/utils';

describe.each(Object.values(providers))('ConnectionService (%s) close method test suite', (provider) => {
  let connection: ConnectionInterface;
  const { envKey, endpoint } = defaultRequests[provider];

  beforeEach(() => {
    connection = getConnectionProvider(provider as Provider)!;
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
