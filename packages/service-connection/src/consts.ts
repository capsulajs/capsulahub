import { AsyncModel, Provider } from './api';

export const providers = {
  websocket: 'websocket' as Provider,
  rsocket: 'rsocket' as Provider,
};

export const asyncModels = {
  requestResponse: 'request/response' as AsyncModel,
  requestStream: 'request/stream' as AsyncModel,
};

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
  invalidModel: 'The model should be "requestResponse" or "requestStream"',
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
