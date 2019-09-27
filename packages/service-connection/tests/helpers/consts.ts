const endpoints = {
  websocket: () => 'wss://echo.websocket.org',
  rsocket: (port: number) => `ws://localhost:${port}`,
};

export const defaultRequests: { [key: string]: any } = {
  websocket: { envKey: 'develop', getEndpoint: endpoints.websocket, data: { hello: 'World !' } },
  rsocket: {
    envKey: 'develop',
    getEndpoint: endpoints.rsocket,
    data: {
      data: {
        qualifier: '/greeting',
        data: { name: 'Dmitriy' },
      },
    },
  },
};

export const defaultEnvKey = 'develop';
