import { Subscription } from 'rxjs';
import { defaultEnvKey, defaultRequests } from '../helpers/consts';
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
  const defaultWsData = '{"hello":"World !"}';
  const defaultRsocketData = '{"data":{"hello":"Greetings to Dmitriy!"}}';
  const streamRsocketData = (count: number) => `{"message":"Original name: Dmitriy","count":${count}}`;

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
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(data);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          if (provider === providers.websocket) {
            expect(event.data).toBe(defaultWsData);
          }
          if (provider === providers.rsocket) {
            expect(event.data).toBe(defaultRsocketData);
          }
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    expect(connection.send(request)).resolves.toEqual(undefined);
    setTimeout(() => {
      expect(count).toEqual(4);
      done();
    }, 2000);
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
    expect.assertions(15);
    let request = { envKey, data };
    let count = 0;

    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

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
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(data);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          if (provider === providers.websocket) {
            expect(event.data).toBe(defaultWsData);
          }
          if (provider === providers.rsocket) {
            expect(event.data).toBe(defaultRsocketData);
          }
          break;
      }
    });
    connection.open({ envKey, endpoint }).then((response) => expect(response).toEqual(undefined));
    expect(connection.send(request)).resolves.toEqual(undefined);
    setTimeout(() => {
      expect(count).toBe(4);
      done();
    }, 2000);
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

  it('Calling send when "pending" state of connection failed', async (done) => {
    expect.assertions(12);
    let count = 0;
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

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
    connection.open({ envKey, endpoint: 'wss://echo.websocket.orgggg/' }).catch((error) => {
      expect(error).toEqual(new Error(messages.connectionError));
    });
    connection.send(request).catch((error) => {
      expect(error).toEqual(new Error(messages.connectionError));
    });

    setTimeout(() => {
      expect(count).toEqual(3);
      done();
    }, 2000);
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

  it(`Calling send with a valid RSocket request (request/stream)`, async (done) => {
    if (provider !== 'rsocket') {
      done();
      return true;
    }
    expect.assertions(23);
    const streamData = { data: { qualifier: '/timer', data: { name: 'Dmitriy' } } };
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
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(streamData);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(streamRsocketData(0));
          break;
        case 5:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(streamRsocketData(1));
          connection.close({ envKey });
          break;
        case 6:
          expect(event.type).toBe(eventTypes.disconnectionStarted);
          expect(event.data).toBe(undefined);
          break;
        case 7:
          expect(event.type).toBe(eventTypes.disconnectionCompleted);
          expect(event.data).toBe(undefined);
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    const request = {
      envKey,
      data: streamData,
      model: asyncModels.requestStream,
    };

    expect(connection.send(request)).resolves.toEqual(undefined);

    setTimeout(() => {
      expect(count).toEqual(7);
      done();
    }, 2000);
  });
});
