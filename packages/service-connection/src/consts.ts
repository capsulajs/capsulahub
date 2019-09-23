export const providers = ['websocket', 'rsocket'];

export const messages = {
  noProvider: 'The provider has not been specified.',
  wrongProvider: 'The provider you tried to use is not supported.',
  invalidRequest: 'The request you provided is not correct.',
  noConnection: (envKey: string) => `${envKey} is not connected.`,
  pendingDisconnection: (envKey: string) => `${envKey} is already disconnecting, please wait.`,
  alreadyConnected: (envKey: string) => `${envKey} is already connected.`,
  pendingConnection: (envKey: string) => `${envKey} is already connecting, please wait.`,
  failedToSend: 'The request has not been sent due to connection failure.',
  connectionError: 'The connection failed to connect.',
  modelRequired: 'The model is required to send this message through RSocket',
  invalidModel: 'The model should be "request/response" or "request/stream"',
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
