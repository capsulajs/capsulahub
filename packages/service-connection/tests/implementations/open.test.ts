import { Subscription } from 'rxjs';
import { defaultRequests } from '../helpers/consts';
import { Connection as ConnectionInterface, ConnectionEvent, Provider } from '../../src/api';
import { eventTypes, messages, providers } from '../../src/consts';
import { getConnectionProvider } from '../helpers/utils';

describe.each(Object.values(providers))('ConnectionService (%s) open method test suite', (provider) => {
  let connection: ConnectionInterface;
  let subscription: Subscription;
  let shouldCloseConnection = false;
  const { envKey, endpoint } = defaultRequests[provider];

  beforeEach(() => {
    connection = getConnectionProvider(provider as Provider)!;
  });

  afterEach(() => {
    subscription && subscription.unsubscribe();
    if (shouldCloseConnection) {
      shouldCloseConnection = false;
      return connection.close({ envKey });
    }
  });

  it('Calling open with a valid request', (done) => {
    expect.assertions(3);
    let count = 0;
    shouldCloseConnection = true;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          done();
          break;
      }
    });
    return expect(connection.open({ envKey, endpoint })).resolves.toEqual(undefined);
  });

  const invalidValues = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.each(invalidValues)('Calling open with an invalid envKey: %s', (invalidEnvKey) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey: invalidEnvKey, endpoint })).rejects.toEqual(
      new Error(messages.invalidRequest)
    );
  });

  it.each(invalidValues)('Calling open with an invalid endpoint: %s', (invalidEndPoint) => {
    expect.assertions(1);
    // @ts-ignore
    return expect(connection.open({ envKey, endpoint: invalidEndPoint })).rejects.toEqual(
      new Error(messages.invalidRequest)
    );
  });

  // TODO don't skip this test
  it.skip('Calling open with a valid request and an error while establishing the connection occurs', (done) => {
    expect.assertions(3);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.error);
          done();
          break;
      }
    });
    return expect(connection.open({ envKey, endpoint: 'wss://echo.websocket.orgggg/' })).rejects.toEqual(
      new Error(messages.connectionError)
    );
  });

  it('Calling open when there is a "pending connection"', (done) => {
    expect.assertions(4);
    shouldCloseConnection = true;
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          done();
          break;
      }
    });
    connection.open({ envKey, endpoint }).then((response) => expect(response).toEqual(undefined));
    return expect(connection.open({ envKey, endpoint })).rejects.toEqual(new Error(messages.pendingConnection(envKey)));
  });

  it('Calling open when connection is already established for `envKey`', async () => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    return expect(connection.open({ envKey, endpoint })).rejects.toEqual(new Error(messages.alreadyConnected(envKey)));
  });
});
