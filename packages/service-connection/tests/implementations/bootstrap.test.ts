import bootstrap from '../../src';
import { messages, providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';
import { baseInvalidValues } from '../helpers/consts';

describe('ConnectionService bootstrap test suite', () => {
  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of WebSocketConnectionService in Workspace', async () => {
    expect.assertions(2);
    const serviceName = 'WebSocketConnectionService';
    const registerServiceMock = jest.fn();
    const workspace = { registerService: registerServiceMock };
    const config = { provider: providers.websocket, serviceName };
    // @ts-ignore
    await bootstrap(workspace, config);
    registerServiceMock.mockResolvedValueOnce({});
    expect(registerServiceMock.mock.calls[0][0].serviceName).toBe(serviceName);
    expect(registerServiceMock.mock.calls[0][0].reference).toBeInstanceOf(WebSocketConnection);
  });

  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of RSocketConnectionService in Workspace', async () => {
    expect.assertions(2);
    const serviceName = 'RSocketConnectionService';
    const registerServiceMock = jest.fn();
    const workspace = { registerService: registerServiceMock };
    const config = { provider: providers.rsocket, serviceName };
    // @ts-ignore
    await bootstrap(workspace, config);
    registerServiceMock.mockResolvedValueOnce({});
    expect(registerServiceMock.mock.calls[0][0].serviceName).toBe(serviceName);
    expect(registerServiceMock.mock.calls[0][0].reference).toBeInstanceOf(RSocketConnection);
  });

  it.each([...baseInvalidValues, 'wrongProvider'])(
    'ConnectionService extension bootstrap function rejects with an' +
      ' error if "provider" is invalid or is not in configuration: %s',
    (invalidProvider) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = { provider: invalidProvider, serviceName: 'ConnectionService' };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(!invalidProvider ? messages.noProvider : messages.wrongProvider));
      });
    }
  );

  it.each(baseInvalidValues)(
    'ConnectionService extension bootstrap function rejects with an error if "serviceName" is invalid or is not in configuration: %s',
    (invalidServiceName) => {
      expect.assertions(1);
      const workspace = { registerService: () => Promise.resolve() };
      const config = { provider: 'rsocket', serviceName: invalidServiceName };
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(messages.noServiceName));
      });
    }
  );
});
