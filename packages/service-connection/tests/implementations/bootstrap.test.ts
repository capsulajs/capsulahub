import bootstrap from '../../src';
import { messages, providers } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';
import RSocketConnection from '../../src/providers/RSocketConnection';

describe('ConnectionService bootstrap test suite', () => {
  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of WebSocketConnectionService in Workspace', async () => {
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

  it('ConnectionService extension bootstrap function rejects with an error if "provider" is not in configuration', () => {
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = {};
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    return bootstrap(workspace, config).catch((error: Error) => {
      expect(error).toEqual(new Error(messages.noProvider));
    });
  });

  it('ConnectionService extension bootstrap function rejects with an error if "serviceName" is not in configuration', () => {
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = { provider: 'rsocket' };
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    return bootstrap(workspace, config).catch((error: Error) => {
      expect(error).toEqual(new Error(messages.noServiceName));
    });
  });
});
