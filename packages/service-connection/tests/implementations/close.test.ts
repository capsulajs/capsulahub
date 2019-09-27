import { Subscription } from 'rxjs';
import { Connection as ConnectionInterface, ConnectionEvent, Provider } from '../../src/api';
import { defaultEnvKey, defaultRequests } from '../helpers/consts';
import { eventTypes, messages, providers } from '../../src/consts';
import { getConnectionProvider } from '../helpers/utils';
import RSocketServer, { IRSocketServer } from '../helpers/RSocketServer';

describe.each(Object.values(providers))('ConnectionService (%s) close method test suite', (provider) => {
  const port = 3030;
  let connection: ConnectionInterface;
  let rsServer: IRSocketServer;
  let subscription: Subscription;
  const { envKey, getEndpoint } = defaultRequests[provider];
  const endpoint = getEndpoint(port);

  beforeAll(() => {
    if (provider === providers.rsocket) {
      rsServer = new RSocketServer({ port });
      return rsServer.start();
    }
  });

  afterAll(() => {
    if (provider === providers.rsocket) {
      return rsServer.stop();
    }
  });

  beforeEach(() => {
    connection = getConnectionProvider(provider as Provider)!;
  });

  afterEach((done) => {
    subscription && subscription.unsubscribe();
    return connection
      .close({ envKey })
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  it('Calling close with a valid request', async (done) => {
    expect.assertions(14);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          expect(event.data).toBe(undefined);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          expect(event.data).toBe(undefined);
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    expect(connection.close({ envKey })).resolves.toEqual(undefined);

    setTimeout(() => {
      expect(count).toBe(4);
      done();
    }, 2000);
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
    expect.assertions(15);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          expect(event.data).toBe(undefined);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          expect(event.data).toBe(undefined);
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    connection.close({ envKey }).then((response) => expect(response).toEqual(undefined));
    expect(connection.close({ envKey })).rejects.toEqual(new Error(messages.pendingDisconnection(envKey)));

    setTimeout(() => {
      expect(count).toBe(4);
      done();
    }, 2000);
  });
});
