import { API } from '..';
import { eventTypes, messages } from '../consts';
import { ValidateByReadyStateRequest } from './types';

export const isRSocketModelValid = (model: any) => model === 'request/response' || model === 'request/stream';

export const isNonEmptyString = (value: any) => typeof value === 'string' && !!value.trim().length;

export const isOpenReqValid = (request: API.OpenConnectionRequest) => {
  return request.envKey && isNonEmptyString(request.envKey) && request.endpoint && isNonEmptyString(request.endpoint);
};

export const isCloseReqValid = (request: API.CloseConnectionRequest) => {
  return request.envKey && isNonEmptyString(request.envKey);
};

export const isSendReqValid = (request: API.SendMessageRequest) => {
  return request.envKey && isNonEmptyString(request.envKey);
};

export const validateReadyStateForOpen = ({ connection, envKey }: ValidateByReadyStateRequest) => {
  const { readyState } = connection!;
  if (readyState === eventTypes.connecting) {
    throw new Error(messages.pendingConnection(envKey));
  } else if (readyState === eventTypes.connected) {
    throw new Error(messages.alreadyConnected(envKey));
  }
  return true;
};

export const validateReadyStateForClose = ({ connection, envKey }: ValidateByReadyStateRequest) => {
  if (!!connection && connection.readyState === eventTypes.disconnecting) {
    throw new Error(messages.pendingDisconnection(envKey));
  } else if (!connection || connection.readyState === eventTypes.disconnected) {
    throw new Error(messages.noConnection(envKey));
  }
  return true;
};

export const validateReadyStateForSend = ({ connection, envKey }: ValidateByReadyStateRequest) => {
  if (
    (connection &&
      (connection.readyState === eventTypes.disconnecting || connection.readyState === eventTypes.disconnected)) ||
    !connection
  ) {
    throw new Error(messages.noConnection(envKey));
  }
  return true;
};
