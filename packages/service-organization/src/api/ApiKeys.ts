import { Claims } from './Claims';

export interface ApiKeys {
  [apiKeyName: string]: {
    /**
     * Describes given identity on some role
     */
    claims: Claims;
    /**
     * ApiKey, that can be used in ConfigurationService
     */
    key: string;
  };
}
