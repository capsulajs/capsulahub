import { API } from '..';

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
