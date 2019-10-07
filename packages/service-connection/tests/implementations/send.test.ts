import { Subscription } from 'rxjs';
import { baseInvalidValues, defaultEnvKey, defaultRequests } from '../helpers/consts';
import { API } from '../../src';
import { asyncModels, eventTypes, messages, providers } from '../../src/consts';
import RSocketServer, { IRSocketServer } from '../helpers/RSocketServer';
import { getConnectionProvider } from '../helpers/utils';

describe.each(Object.values(providers))('ConnectionService (%s) send method test suite', (provider) => {
  const port = 8080;
  let connection: API.Connection;
  let rsServer: IRSocketServer;
  let subscription: Subscription;
  const { envKey, getEndpoint, data } = defaultRequests[provider];
  const endpoint = getEndpoint(port);
  const defaultWsData = '{"hello":"World !"}';
  const rsocketRequestResponseResponse = '{"data":{"hello":"Greetings to Dmitriy!"}}';
  const getRsocketRequestStreamResponse = (currentCount: number, countLeft: number) =>
    `{"data":{"currentCount":${currentCount},"countLeft":${countLeft}}}`;

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
    connection = getConnectionProvider(provider as API.Provider)!;
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

  it(`Calling send with a valid request (${provider})`, async (done) => {
    expect.assertions(18);
    let count = 0;
    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(endpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connected);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(data);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(provider === providers.websocket ? defaultWsData : rsocketRequestResponseResponse);
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }

    expect(connection.send(request)).resolves.toEqual(undefined);
    setTimeout(() => {
      expect(count).toEqual(4);
      done();
    }, 2000);
  });

  it(`Calling send without providing model (${provider})`, () => {
    if (provider !== providers.rsocket) {
      return Promise.resolve(true);
    }
    expect.assertions(1);
    return connection
      .open({ envKey, endpoint })
      .then(() => expect(connection.send({ envKey, data })).rejects.toEqual(new Error(messages.invalidModel)));
  });

  it('Calling send when the connection is in "pending" state', (done) => {
    expect.assertions(19);
    let request = { envKey, data };
    let count = 0;

    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }

    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(endpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connected);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(data);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(provider === providers.websocket ? defaultWsData : rsocketRequestResponseResponse);
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

  it.each(baseInvalidValues)('Calling send with a invalid envKey', async (invalidEnvKey) => {
    expect.assertions(1);
    await connection.open({ envKey, endpoint });
    let invalidRequest = { envKey: invalidEnvKey, data };
    if (provider === providers.rsocket) {
      invalidRequest = { ...invalidRequest, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }
    // @ts-ignore
    return expect(connection.send(invalidRequest)).rejects.toEqual(new Error(messages.invalidRequest));
  });

  it.each(baseInvalidValues)(`Calling send with a invalid model (${provider})`, async (invalidModel) => {
    if (provider !== providers.rsocket) {
      return true;
    }
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
      request = { ...request, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }
    return expect(connection.send(request)).rejects.toEqual(new Error(messages.noConnection(envKey)));
  });

  it('Calling send when "pending" state of connection failed', async (done) => {
    const wrongEndpoint = 'wss://echo.websocket.orgggg/';
    expect.assertions(15);
    let count = 0;
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }

    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(wrongEndpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.error);
          expect(event.data).toBe(messages.connectionError);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.disconnected);
          expect(event.data).toBe(undefined);
          break;
      }
    });
    connection.open({ envKey, endpoint: wrongEndpoint }).catch((error) => {
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
      request = { ...request, model: asyncModels.requestResponse } as API.SendMessageRequest;
    }

    await connection.open({ envKey, endpoint });
    connection.close({ envKey });
    return connection
      .send(request)
      .catch((error) => expect(error).toEqual(new Error(messages.noConnection(envKey))))
      .then(done);
  });

  it(`Calling send with a valid RSocket request (request/stream)`, async (done) => {
    if (provider !== providers.rsocket) {
      done();
      return true;
    }
    expect.assertions(30);
    const streamData = { data: { qualifier: '/timer', data: { count: 100 } } };
    let count = 0;
    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(endpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connected);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(streamData);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(getRsocketRequestStreamResponse(1, 99));
          break;
        case 5:
          expect(event.type).toBe(eventTypes.messageReceived);
          expect(event.data).toBe(getRsocketRequestStreamResponse(2, 98));
          connection.close({ envKey });
          break;
        case 6:
          expect(event.type).toBe(eventTypes.disconnecting);
          expect(event.data).toBe(undefined);
          break;
        case 7:
          expect(event.type).toBe(eventTypes.disconnected);
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

  it(`Calling send with a valid RSocket request (request/response) - server error has been received`, async (done) => {
    if (provider !== providers.rsocket) {
      done();
      return true;
    }
    expect.assertions(18);
    const requestData = { data: { qualifier: '/greeting', data: {} } };
    let count = 0;
    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(endpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connected);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(requestData);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.error);
          expect(event.data).toBe('Server error: "name" should be provided for "/greeting"');
          break;
      }
    });
    await connection.open({ envKey, endpoint });
    const request = {
      envKey,
      data: requestData,
      model: asyncModels.requestResponse,
    };

    expect(connection.send(request)).resolves.toEqual(undefined);

    setTimeout(() => {
      expect(count).toEqual(4);
      done();
    }, 2000);
  });

  it(`Calling send with a valid RSocket request (request/stream) - server error has been received`, async (done) => {
    if (provider !== providers.rsocket) {
      done();
      return true;
    }
    expect.assertions(18);
    const streamData = { data: { qualifier: '/timer', data: {} } };
    let count = 0;
    subscription = connection.events$({}).subscribe((event: API.ConnectionEventData) => {
      expect(event.envKey).toEqual(defaultEnvKey);
      expect(event.endpoint).toEqual(endpoint);
      count++;
      switch (count) {
        case 1:
          expect(event.type).toBe(eventTypes.connecting);
          expect(event.data).toBe(undefined);
          break;
        case 2:
          expect(event.type).toBe(eventTypes.connected);
          expect(event.data).toBe(undefined);
          break;
        case 3:
          expect(event.type).toBe(eventTypes.messageSent);
          expect(event.data).toBe(streamData);
          break;
        case 4:
          expect(event.type).toBe(eventTypes.error);
          expect(event.data).toBe('Server error: "count" should be provided for "/timer"');
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
      expect(count).toEqual(4);
      done();
    }, 2000);
  });
});
