import { Subscription } from 'rxjs';
import { defaultRequests } from '../helpers/consts';
import { Connection as ConnectionInterface, ConnectionEvent, Provider, SendMessageRequest } from '../../src/api';
import { asyncModels, eventTypes, messages, providers } from '../../src/consts';
import RSocketServer, { IRSocketServer } from '../helpers/rSocketServer';
import { getConnectionProvider } from '../helpers/utils';

describe.each(Object.values(providers))('ConnectionService (%s) send method test suite', (provider) => {
  let connection: ConnectionInterface;
  let rsServer: IRSocketServer;
  let subscription: Subscription;
  let shouldCloseConnection = false;
  const { envKey, endpoint, data } = defaultRequests[provider];

  beforeAll(() => {
    if (provider === providers.rsocket) {
      rsServer = new RSocketServer();
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

  afterEach(() => {
    subscription && subscription.unsubscribe();
    if (shouldCloseConnection) {
      shouldCloseConnection = false;
      return connection.close({ envKey });
    }
  });

  it(`Calling send with a valid request (${provider})`, async (done) => {
    expect.assertions(5);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          done();
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    return expect(connection.send(request)).resolves.toEqual(undefined);
  });

  it(`Calling send without providing model (${provider})`, () => {
    if (provider !== 'rsocket') {
      return Promise.resolve(true);
    }
    shouldCloseConnection = true;
    expect.assertions(1);
    return connection
      .open({ envKey, endpoint })
      .then(() => expect(connection.send({ envKey, data })).rejects.toEqual(new Error(messages.invalidModel)));
  });

  it('Calling send when the connection is in "pending" state', (done) => {
    shouldCloseConnection = true;
    expect.assertions(6);
    let request = { envKey, data };
    let count = 0;

    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          done();
          break;
      }
    });
    connection.open({ envKey, endpoint }).then((response) => expect(response).toEqual(undefined));
    return expect(connection.send(request)).resolves.toEqual(undefined);
  });

  const invalidValues = [null, undefined, 123, ' ', true, [], ['test'], {}, { test: 'test' }];

  it.each(invalidValues)('Calling send with a invalid envKey', (invalidEnvKey) => {
    expect.assertions(1);
    let invalidRequest = { envKey: invalidEnvKey, data };
    if (provider === providers.rsocket) {
      invalidRequest = { ...invalidRequest, model: asyncModels.requestResponse } as SendMessageRequest;
    }
    // @ts-ignore
    return expect(connection.send(invalidRequest)).rejects.toEqual(new Error(messages.invalidRequest));
  });

  it.each(invalidValues)(`Calling send with a invalid model (${provider})`, async (invalidModel) => {
    if (provider !== 'rsocket') {
      return true;
    }
    shouldCloseConnection = true;
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    // @ts-ignore
    return expect(connection.send({ envKey, model: invalidModel, data })).rejects.toEqual(
      new Error(messages.invalidModel)
    );
  });

  it('Calling send when there is no open connection and "pending" state of connection', () => {
    expect.assertions(1);
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }
    return expect(connection.send(request)).rejects.toEqual(new Error(messages.noConnection(envKey)));
  });

  // TODO Remove timeout
  it('Calling send when "pending" state of connection failed', async (done) => {
    expect.assertions(4);
    let count = 0;
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.error);
          break;
      }
    });
    connection.open({ envKey, endpoint: 'wss://echo.websocket.orgggg/' }).catch((error) => {
      expect(error).toEqual(new Error(messages.connectionError));
    });
    connection.send(request).catch((error) => {
      expect(error).toEqual(new Error(messages.connectionError));
    });

    setTimeout(done, 2000);
  });

  it('Calling send when "pending closing of connection" exists', async (done) => {
    expect.assertions(1);
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    await connection.open({ envKey, endpoint });
    connection.close({ envKey });
    return connection
      .send(request)
      .catch((error) => expect(error).toEqual(new Error(messages.noConnection(envKey))))
      .finally(() => done());
  });
});

describe('RSocket', () => {
  let connection: ConnectionInterface;
  let rsServer: IRSocketServer;
  let subscription: Subscription;
  let shouldCloseConnection = false;
  const { envKey, endpoint, data } = defaultRequests.rsocket;

  beforeAll(() => {
    rsServer = new RSocketServer();
    return rsServer.start();
  });

  afterAll(() => {
    return rsServer.stop();
  });

  beforeEach(() => {
    connection = getConnectionProvider('rsocket')!;
  });

  afterEach(() => {
    subscription && subscription.unsubscribe();
    if (shouldCloseConnection) {
      shouldCloseConnection = false;
      return connection.close({ envKey });
    }
  });

  it(`Calling send with a valid request (request/stream)`, async (done) => {
    expect.assertions(8);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: ConnectionEvent) => {
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connectionStarted);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connectionCompleted);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          break;
        case 5:
          expect(event.type).toBe(eventTypes.messageReceived);
          connection.close({ envKey });
          break;
        case 6:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          break;
        case 7:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    const request = { envKey, data, model: asyncModels.requestStream };

    expect(connection.send(request)).resolves.toEqual(undefined);

    setTimeout(done, 2000);
  });
});
