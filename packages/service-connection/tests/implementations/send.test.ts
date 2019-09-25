import { defaultRequests } from '../helpers/consts';
import { Connection as ConnectionInterface, ConnectionEvent, Provider, SendMessageRequest } from '../../src/api';
import { asyncModels, eventTypes, messages, providers } from '../../src/consts';
import RSocketServer, { IRSocketServer } from '../helpers/rSocketServer';
import { getConnectionProvider } from '../helpers/utils';

describe.each(Object.values(providers))('ConnectionService (%s) send method test suite', (provider) => {
  let connection: ConnectionInterface;
  let rsServer: IRSocketServer;
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

  it(`Calling send with a valid request (${provider})`, async (done) => {
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
    expect.assertions(1);
    return connection
      .open({ envKey, endpoint })
      .then(() => expect(connection.send({ envKey, data })).rejects.toEqual(new Error(messages.invalidModel)));
  });

  it('Calling send when the connection is in "pending" state', (done) => {
    expect.assertions(6);
    let request = { envKey, data };
    let count = 0;

    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

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

  // TODO don't skip this test
  it.skip('Calling send when "pending" state of connection failed', async () => {
    expect.assertions(3);
    let count = 0;
    let request = { envKey, data };
    if (provider === providers.rsocket) {
      request = { ...request, model: asyncModels.requestResponse } as SendMessageRequest;
    }

    connection.events$({}).subscribe((event: ConnectionEvent) => {
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
    await connection.open({ envKey, endpoint });
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
