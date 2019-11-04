import {
  AddApiKeyRequest,
  ApiKeysResponse,
  DeleteApiKeyRequest,
  TokenRequest,
  Organization,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  BaseOrganizationRequest,
} from '.';

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
   * A Promise that will be resolved with all the current api keys after a new api key has been added
   * The promise can be rejected if
   * - addApiKeyRequest is not correct
   * - there is a server error (network or server validation)
   */
  addApiKey(addApiKeyRequest: AddApiKeyRequest): Promise<ApiKeysResponse>;
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
   * A Promise that will be resolved with all the current api keys after a provided api key has been deleted
   * The promise can be rejected if
   * - deleteApiKeyRequest is not correct
   * - there is a server error (network or server validation)
   */
  deleteApiKey(deleteApiKeyRequest: DeleteApiKeyRequest): Promise<ApiKeysResponse>;
  /**
   * This operation enables each organization member to get the list of all relevant organizations (full info)
   * which the member was invited.
   *
   * Note: this method returns all organization info thus API keys with:
   * - all accessible permission levels ("Owner" | "Admin" | "Member") will be returned only for the related Organization Owner
   * - "Admin" | "Member" permission levels will be returned only for the related Organization Admin
   * - "Member" permission level will be returned only for the related Organization Member
   *
   * @returns
   * A Promise that will be resolved with the organizations in which a user is a member
   * The promise can be rejected if
   * - getMyOrganizationsRequest is not correct
   * - there is a server error (network or server validation)
   */
  getMyOrganizations(getMyOrganizationsRequest: TokenRequest): Promise<Organization[]>;
  /**
   * This operation enables any user with valid Token to create the specific organization and store its information (metadata).
   * Organization name can only contain characters in range A-Z, a-z, 0-9 as well as underscore, period, dash & percent.
   *
   * @returns
   * A Promise that will be resolved when a new organization has been created
   * The promise can be rejected if
   * - createOrganizationRequest is not correct
   * - there is a server error (network or server validation)
   */
  createOrganization(createOrganizationRequest: CreateOrganizationRequest): Promise<void>;
  /**
   * This operation enables all members of the relevant organization to get the full organization information.
   *
   * Note: this method returns all organization info thus API keys with:
   * - all accessible permission levels ("Owner" | "Admin" | "Member") will be returned only for the related Organization Owner
   * - "Admin" | "Member" permission levels will be returned only for the related Organization Admin
   * - "Member" permission level will be returned only for the related Organization Member
   *
   * @returns
   * A Promise that will be resolved with the information about a requested organization
   * The promise can be rejected if
   * - getOrganizationRequest is not correct
   * - there is a server error (network or server validation)
   */
  getOrganization(getOrganizationRequest: BaseOrganizationRequest): Promise<Organization>;
  /**
   * This operation enables only organization managers (Owner | Admin) to update (edit) the specific organization
   * information (name or email) optionally.
   *
   * Note: this method returns all organization info thus API keys with:
   * - all accessible permission levels ("Owner" | "Admin" | "Member") will be returned only for the related Organization Owner
   * - "Admin" | "Member" permission levels will be returned only for the related Organization Admin
   * - "Member" permission level will be returned only for the related Organization Member
   *
   * @returns
   * A Promise that will be resolved, when the specified organization data has been updated
   * The promise can be rejected if
   * - updateOrganizationRequest is not correct
   * - there is a server error (network or server validation)
   */
  updateOrganization(updateOrganizationRequest: UpdateOrganizationRequest): Promise<void>;
  /**
   * This operation enables only Owners to delete relevant organization.
   * All relevant API keys issued for organization also deleted thus become invalid after specific period of time
   * is left upon this operation was done.
   *
   * @returns
   * A Promise that will be resolved, when the specified organization has been deleted
   * The promise can be rejected if
   * - deleteOrganizationRequest is not correct
   * - there is a server error (network or server validation)
   */
  deleteOrganization(deleteOrganizationRequest: BaseOrganizationRequest): Promise<void>;
  /**
   * This operation enables each organization member to step-out (leave) from the relevant organization.
   * Nevertheless at least one Owner (origin or granted one) should be persisted in the organization.
   *
   * @returns
   * A Promise that will be resolved, when a user has left the organization
   * The promise can be rejected if
   * - deleteOrganizationRequest is not correct
   * - there is a server error (network or server validation)
   */
  leaveOrganization(deleteOrganizationRequest: BaseOrganizationRequest): Promise<void>;
}
