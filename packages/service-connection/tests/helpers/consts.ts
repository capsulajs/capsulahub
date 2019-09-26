const endpoints = {
  websocket: 'wss://echo.websocket.org',
  rsocket: 'ws://localhost:8080',
};

export const defaultRequests: { [key: string]: any } = {
  websocket: { envKey: 'develop', endpoint: endpoints.websocket, data: { hello: 'World !' } },
  rsocket: {
    envKey: 'develop',
    endpoint: endpoints.rsocket,
    data: {
      data: {
        qualifier: '/greeting',
        data: { name: 'Dmitriy' },
      },
    },
  },
};

export const defaultEnvKey = 'develop';
