import { TokenRequest } from './TokenRequest';

export interface BaseOrganizationRequest extends TokenRequest {
  /**
   * Already stored id for the specific organization
   */
  organizationId: string;
}
