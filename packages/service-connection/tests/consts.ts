const endpoints = {
  websocket: 'wss://echo.websocket.org',
  rsocket: '',
};

export const defaultRequests: { [key: string]: any } = {
  websocket: { envKey: 'develop', endpoint: endpoints.websocket, data: {} },
  rsocket: { envKey: 'develop', endpoint: endpoints.rsocket, data: {} },
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
