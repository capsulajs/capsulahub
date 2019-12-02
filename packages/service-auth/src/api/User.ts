import { Auth0Identity } from 'auth0-js';

/**
 * The data of an authorized user
 */
export interface User {
  /**
   * auth0 id token
   */
  token: string;
  name: string;
  nickname: string;
  picture: string;
  isNewUser: boolean;
  userId: string;
  updatedAt: string;
  identities: Auth0Identity[];
  sub: string;
  userName?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  isEmailVerified?: boolean;
  gender?: string;
  locale?: string;
  createdAt?: string;
  userMetadata?: any;
  appMetadata?: any;
}
