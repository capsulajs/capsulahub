import { AddApiKeyRequest } from './AddApiKeyRequest';

export interface OrganizationService {
  /**
   * This operation enables only organization managers (Owner | Admin) to create the API keys (token) for the
   * relevant organization and further to be used (write and read ability) by potential users of the
   * Configuration service according to appropriate permission level.
   * Each API key got the unique name which couldn't be duplicated.
   * Thus Owners could issue the API keys with all accessible roles but the Admins are restricted by the
   * "Admin" or "Member" role API keys issuing.
   *
   * Note: this method returns all organization info thus API keys with:
   * - all accessible permission levels ("Owner" | "Admin" | "Member") will be returned only for the related Organization Owner
   * - "Admin" | "Member" permission levels will be returned only for the related Organization Admin
   * - "Member" permission level will be returned only for the related Organization Member
   * @returns
   * A Promise that will be resolved when a new connection will be established
   * The promise can be rejected if
   * - addApiKeyRequest is not correct
   * - there is a server error (network or server validation)
   */
  addApiKey(addApiKeyRequest: AddApiKeyRequest): Promise<void>;
  /**
   * This operation enables only organization managers (Owner | Admin) to delete the API keys (token) from the relevant organization.
   * Thus write or read rights will be revoked from the consumers of the Configuration service who was using the related terminated API key.
   *
   * Note: this method returns all organization info thus API keys with:
   * - all accessible permission levels ("Owner" | "Admin" | "Member") will be returned only for the related Organization Owner
   * - "Admin" | "Member" permission levels will be returned only for the related Organization Admin
   * - "Member" permission level will be returned only for the related Organization Member
   *
   * @returns
   * A Promise that will be resolved when a new connection will be established
   * The promise can be rejected if
   * - deleteApiKeyRequest is not correct
   * - there is a server error (network or server validation)
   */
  deleteApiKey(deleteApiKeyRequest: AddApiKeyRequest): Promise<void>;
}
