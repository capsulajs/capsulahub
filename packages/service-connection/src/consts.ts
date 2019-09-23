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

/**
 * The readyState of WebSocket connection:
 * 'Connecting' - 0
 * 'Connected' - 1
 * 'Disconnecting' - 2
 * 'Disconnected' - 3
 */
export const wsReadyStates = {
  connecting: 'Connecting',
  connected: 'Connected',
  disconnecting: 'Disconnecting',
  disconnected: 'Disconnected',
};

export const connectionEventType = {
  request: 'Request',
  response: 'Response',
  error: 'Error',
};
