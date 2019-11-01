import { Claims } from './Claims';

export interface AddApiKeyResponse {
  apiKeys: {
    [apiKeyName: string]: {
      claims: Claims;
      key: string;
    };
  };
}
