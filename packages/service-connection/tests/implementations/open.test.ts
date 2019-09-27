import { Subscription } from 'rxjs';
import { baseInvalidValues, defaultEnvKey, defaultRequests } from '../helpers/consts';
import { Connection as ConnectionInterface, ConnectionEvent, Provider } from '../../src/api';
import { eventTypes, messages, providers } from '../../src/consts';
import { getConnectionProvider } from '../helpers/utils';
import RSocketServer, { IRSocketServer } from '../helpers/RSocketServer';

describe.each(Object.values(providers))('ConnectionService (%s) open method test suite', (provider) => {
  const port = 4040;
  let connection: ConnectionInterface;
  let subscription: Subscription;
  let rsServer: IRSocketServer;
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

  it('Calling open with a valid request', (done) => {
    expect.assertions(8);
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
      }
    });
    expect(connection.open({ envKey, endpoint })).resolves.toEqual(undefined);
    setTimeout(() => {
      expect(count).toBe(2);
      done();
    }, 2000);
  });

  it.each(baseInvalidValues)('Calling open with an invalid envKey: %s', (invalidEnvKey) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey: invalidEnvKey, endpoint })).rejects.toEqual(
      new Error(messages.invalidRequest)
    );
  });

  it.each(baseInvalidValues)('Calling open with an invalid endpoint: %s', (invalidEndPoint) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey, endpoint: invalidEndPoint })).rejects.toEqual(
      new Error(messages.invalidRequest)
    );
  });

  it('Calling open with a valid request and an error while establishing the connection occurs', (done) => {
    expect.assertions(11);
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
          expect(event.type).toBe(eventTypes.error);
          expect(event.data).toBe(messages.connectionError);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          expect(event.data).toBe(undefined);
          break;
      }
    });
    expect(connection.open({ envKey, endpoint: 'wss://echo.websocket.orgggg/' })).rejects.toEqual(
      new Error(messages.connectionError)
    );

    setTimeout(() => {
      expect(count).toEqual(3);
      done();
    }, 2000);
  });

  // TODO Add feature
  it('Calling open with a valid request and an error while the creation of Client', (done) => {
    expect.assertions(11);
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
          expect(event.type).toBe(eventTypes.error);
          if (provider === providers.websocket) {
            expect(event.data).toBe(messages.invalidURL('w'));
          }
          if (provider === providers.rsocket) {
            expect(event.data).toBe(messages.connectionError);
          }
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          expect(event.data).toBe(undefined);
          break;
      }
    });

    connection.open({ envKey, endpoint: 'w' }).catch((error: Error) => {
      expect(error.message).toBe(messages.connectionError);
    });
    setTimeout(() => {
      expect(count).toEqual(3);
      done();
    }, 2000);
  });

  it('Calling open when there is a "pending connection"', (done) => {
    expect.assertions(9);
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
      }
    });
    connection.open({ envKey, endpoint }).then((response) => expect(response).toEqual(undefined));
    expect(connection.open({ envKey, endpoint })).rejects.toEqual(new Error(messages.pendingConnection(envKey)));

    setTimeout(() => {
      expect(count).toEqual(2);
      done();
    }, 2000);
  });

  it('Calling open when connection is already established for `envKey`', async () => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    return expect(connection.open({ envKey, endpoint })).rejects.toEqual(new Error(messages.alreadyConnected(envKey)));
  });
});
