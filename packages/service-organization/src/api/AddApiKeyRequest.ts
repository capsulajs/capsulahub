import { Claims } from './Claims';
import { BaseOrganizationRequest } from './BaseOrganizationRequest';

export interface AddApiKeyRequest extends BaseOrganizationRequest {
  /**
   * Specified name for the relevant API key
   */
  apiKeyName: string;
  /**
   * Describes given identity on some role
   */
  claims: Claims;
}
