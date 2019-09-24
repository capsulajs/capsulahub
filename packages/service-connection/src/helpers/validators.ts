import { OpenConnectionRequest } from '../api';

// const isRSocketModelValid = model => model === 'request/response' || model === 'request/stream';

const isNonEmptyString = (value: any) => typeof value === 'string' && !!value.replace(/\s/g, '').length;

export const isOpenReqValid = (request: OpenConnectionRequest) => {
  return request.envKey && isNonEmptyString(request.envKey) && request.endpoint && isNonEmptyString(request.endpoint);
};
