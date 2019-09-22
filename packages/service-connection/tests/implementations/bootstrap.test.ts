import bootstrap from '../../src';
import { messages } from '../../src/consts';
import WebSocketConnection from '../../src/providers/WebSocketConnection';

describe('ConnectionService bootstrap test suite', () => {
  it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of WebSocketConnectionService in Workspace', async () => {
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = { provider: 'websocket' };
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    await bootstrap(workspace, config);
    expect(mock.mock.calls[0][0].reference).toBeInstanceOf(WebSocketConnection);
  });

  // it('ConnectionService extension bootstrap function resolves correctly and triggers the registration of an instance of RSocketConnectionService in Workspace', async () => {
  //   const mock = jest.fn();
  //   const workspace = { registerService: mock };
  //   const config = { provider: 'rsocket' };
  //   mock.mockResolvedValueOnce({});
  //   await bootstrap(workspace, config);
  //   expect(mock.mock.calls[0][0].reference).toBeInstanceOf(RSocket);
  // });

  // it('ConnectionService extension bootstrap function rejects with an error if the creation of an instance of ConnectionService throws an error', async () => {});

  it('ConnectionService extension bootstrap function rejects with an error if "provider" is not in configuration', async () => {
    const mock = jest.fn();
    const workspace = { registerService: mock };
    const config = {};
    mock.mockResolvedValueOnce({});
    // @ts-ignore
    return bootstrap(workspace, config).catch((error: Error) => {
      expect(error).toEqual(new Error(messages.noProvider));
    });
  });
});
