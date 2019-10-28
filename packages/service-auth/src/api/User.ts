/**
 * The data of an authorized user
 */
export interface User {
  /**
   * auth0 token
   */
  token: string;
  name?: string;
  givenName?: string;
  familyName?: string;
  middleName?: string;
  nickname?: string;
  preferredUsername?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  isEmailVerified?: boolean;
  gender?: string;
  birthDate?: string;
  zoneInfo?: string;
  locale?: string;
  phoneNumber?: string;
  isPhoneNumberVerified?: boolean;
  address?: string;
  updatedAt?: string;
  expirationTime?: number;
}
