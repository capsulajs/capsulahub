import bootstrap from '../../src';
import { messages, providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';
import { baseInvalidValues } from '../helpers/consts';

describe('ConnectionService bootstrap test suite', () => {
  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of WebSocketConnectionService in Workspace', async () => {
    expect.assertions(2);
    const serviceName = 'WebSocketConnectionService';
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = { provider: providers.websocket, serviceName };
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    await bootstrap(workspace, config);
    expect(mock.mock.calls[0][0].serviceName).toBe(serviceName);
    expect(mock.mock.calls[0][0].reference).toBeInstanceOf(WebSocketConnection);
  });

  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of RSocketConnectionService in Workspace', async () => {
    expect.assertions(2);
    const serviceName = 'RSocketConnectionService';
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = { provider: providers.rsocket, serviceName };
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    await bootstrap(workspace, config);
    expect(mock.mock.calls[0][0].serviceName).toBe(serviceName);
    expect(mock.mock.calls[0][0].reference).toBeInstanceOf(RSocketConnection);
  });

  it.each([...baseInvalidValues, 'wrongProvider'])(
    'ConnectionService extension bootstrap function rejects with an' +
      ' error if "provider" is not in configuration: %s',
    (invalidProvider) => {
      expect.assertions(1);
      const mock = jest.fn();
      const workspace = { registerService: mock };
      const config = { provider: invalidProvider, serviceName: 'ConnectionService' };
      mock.mockResolvedValueOnce({});
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(!invalidProvider ? messages.noProvider : messages.wrongProvider));
      });
    }
  );

  it.each(baseInvalidValues)(
    'ConnectionService extension bootstrap function rejects with an error if "serviceName" is not in configuration: %s',
    (invalidServiceName) => {
      expect.assertions(1);
      const mock = jest.fn();
      const workspace = { registerService: mock };
      const config = { provider: 'rsocket', serviceName: invalidServiceName };
      mock.mockResolvedValueOnce({});
      // @ts-ignore
      return bootstrap(workspace, config).catch((error: Error) => {
        expect(error).toEqual(new Error(messages.noServiceName));
      });
    }
  );
});
