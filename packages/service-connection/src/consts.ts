import { API } from '.';

export const providers = {
  websocket: 'websocket' as API.Provider,
  rsocket: 'rsocket' as API.Provider,
};

export const asyncModels = {
  requestResponse: 'request/response' as API.AsyncModel,
  requestStream: 'request/stream' as API.AsyncModel,
};

export const messages = {
  noProvider: 'The provider has not been specified.',
  noServiceName: 'ServiceName is missing or has a wrong format',
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
  invalidURL: (url: string) => `The URL '${url}' is invalid.`,
};

export const eventTypes = {
  connecting: 'connecting' as API.ConnectingEvent,
  connected: 'connected' as API.ConnectedEvent,
  disconnecting: 'disconnecting' as API.DisconnectingEvent,
  disconnected: 'disconnected' as API.DisconnectedEvent,
  error: 'error' as API.ErrorEvent,
  messageSent: 'messageSent' as API.MessageSentEvent,
  messageReceived: 'messageReceived' as API.MessageReceivedEvent,
};
