import { TokenRequest } from './TokenRequest';

export interface CreateOrganizationRequest extends TokenRequest {
  /**
   * Specified organization name
   */
  name: string;
  /**
   * Specified organization e-mail
   */
  email: string;
}
