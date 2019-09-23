export const providers = ['websocket'];
// export const providers = ['websocket', 'rsocket'];

const endpoints = {
  websocket: 'wss://echo.websocket.org',
  rsocket: '',
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
  connectionStarted: 'connectionStarted',
  connectionCompleted: 'connectionCompleted',
  disconnectionStarted: 'disconnectionStarted',
  disconnectionCompleted: 'disconnectionCompleted',
  error: 'error',
  messageSent: 'messageSent',
  messageReceived: 'messageReceived',
};
