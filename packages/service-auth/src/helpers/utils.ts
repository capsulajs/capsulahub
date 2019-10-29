import Auth0Lock from 'auth0-lock';
import { Auth0UserProfile } from 'auth0-js';
import { API } from '../index';

export const createLock = (options: Pick<API.AuthServiceConfig, 'domain' | 'clientId'>) => {
  return new Auth0Lock(options.clientId, options.domain, {
    allowAutocomplete: true,
    auth: {
      redirect: false,
      responseType: 'token id_token',
    },
    loginAfterSignUp: true,
  });
};

export const mapUserInfoToAuthData = (userInfo: Auth0UserProfile, idToken: string) => ({
  token: idToken,
  name: userInfo.name,
  givenName: userInfo.given_name,
  familyName: userInfo.family_name,
  middleName: string,
  nickname: string,
  preferredUsername: string,
  profile: string,
  picture: string,
  website: string,
  email: string,
  isEmailVerified: boolean,
  gender: string,
  birthDate: string,
  zoneInfo: string,
  locale: string,
  phoneNumber: string,
  isPhoneNumberVerified: boolean,
  address: string,
  updatedAt: string,
  expirationTime: number,
});
