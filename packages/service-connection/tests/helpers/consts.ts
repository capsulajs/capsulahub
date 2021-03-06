import { API } from '../../src';

export const baseInvalidValues = [null, undefined, 123, ' ', '', true, false, [], ['test'], {}, { test: 'test' }];

const endpoints = {
  websocket: (_: number) => 'ws://echo.websocket.org/echo',
  rsocket: (port: number) => `ws://localhost:${port}`,
};

interface DefaultRequest {
  envKey: string;
  getEndpoint: (port: number) => string;
  data: object;
}

export const defaultEnvKey = 'develop';

export const defaultRequests: Record<API.Provider, DefaultRequest> = {
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
