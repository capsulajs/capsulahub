export const providers = ['rsocket'];
// export const providers = ['websocket'];
// export const providers = ['websocket', 'rsocket'];

const endpoints = {
  websocket: 'wss://echo.websocket.org',
  rsocket: 'wss://configuration-service-staging-rs.genesis.om2.com',
};

export const defaultRequests: { [key: string]: any } = {
  websocket: { envKey: 'develop', endpoint: endpoints.websocket, data: {} },
  rsocket: { envKey: 'develop', endpoint: endpoints.rsocket, data: {} },
};

export const rsocketModels = {
  response: 'request/response',
  stream: 'request/stream',
};

export const eventTypes = {
  connectionStarted: 'connecting',
  connectionCompleted: 'connected',
  disconnectionStarted: 'disconnecting',
  disconnectionCompleted: 'disconnected',
  error: 'error',
  messageSent: 'messageSent',
  messageReceived: 'messageReceived',
};
