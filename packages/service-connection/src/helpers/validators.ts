import { CloseConnectionRequest, OpenConnectionRequest, SendMessageRequest } from '../api';

export const isRSocketModelValid = (model: any) => model === 'request/response' || model === 'request/stream';

const isNonEmptyString = (value: any) => typeof value === 'string' && !!value.replace(/\s/g, '').length;

export const isOpenReqValid = (request: OpenConnectionRequest) => {
  return request.envKey && isNonEmptyString(request.envKey) && request.endpoint && isNonEmptyString(request.endpoint);
};

export const isCloseReqValid = (request: CloseConnectionRequest) => {
  return request.envKey && isNonEmptyString(request.envKey);
};

export const isSendReqValid = (request: SendMessageRequest) => {
  return request.envKey && isNonEmptyString(request.envKey);
};
