import { Provider } from '../../src/api';

const endpoints = {
  websocket: (_: number) => 'wss://echo.websocket.org',
  rsocket: (port: number) => `ws://localhost:${port}`,
};

interface DefaultRequest {
  envKey: string;
  getEndpoint: (port: number) => string;
  data: object;
}

export const defaultEnvKey = 'develop';

export const defaultRequests: Record<Provider, DefaultRequest> = {
  websocket: { envKey: 'develop', getEndpoint: endpoints.websocket, data: { hello: 'World !' } },
  rsocket: {
    envKey: defaultEnvKey,
    getEndpoint: endpoints.rsocket,
    data: {
      data: {
        qualifier: '/greeting',
        data: { name: 'Dmitriy' },
      },
    },
  },
};
