import { ApiKeys } from './ApiKeys';

export interface Organization {
  /**
   * Map of all apiKeys
   */
  apiKeys: ApiKeys;
  /**
   * Already generated id for the created organization
   */
  id: string;
  /**
   * Organization name
   */
  name: string;
  /**
   * Organization email
   */
  email: string;
}
