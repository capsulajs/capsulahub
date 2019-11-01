import { Claims } from './Claims';

export interface ApiKeys {
  [apiKeyName: string]: {
    claims: Claims;
    key: string;
  };
}
