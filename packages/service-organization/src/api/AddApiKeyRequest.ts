import { Role } from './Role';

export interface AddApiKeyRequest {
  /**
   * The requested token issued by relevant authority (Auth0)
   */
  token: string;
  /**
   * Already stored org-id for the specific organization
   */
  organizationId: string;
  /**
   * Specified name for the relevant API key
   */
  apiKeyName: string;
  /**
   * Describes given identity on some role
   */
  claims: {
    role: Role;
  };
}
