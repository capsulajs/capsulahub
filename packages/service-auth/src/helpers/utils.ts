import Auth0Lock from 'auth0-lock';
import { Auth0UserProfile } from 'auth0-js';
import omitBy from 'lodash.omitby';
import { API } from '../index';

export const createLock = (options: Pick<API.AuthServiceConfig, 'domain' | 'clientId' | 'lockOptions'>) => {
  const additionalOptions = {
    allowAutocomplete: true,
    allowedConnections: ['google-oauth2', 'github', 'Username-Password-Authentication'],
    allowShowPassword: true,
    autoclose: false,
    autofocus: true,
    avatar: null,
    auth: {
      redirect: false,
      responseType: 'token id_token',
    },
    loginAfterSignUp: true,
    closable: true,
    ...(options.lockOptions || {}),
  };
  return new Auth0Lock(options.clientId, options.domain, additionalOptions);
};

export const mapUserInfoToAuthData = (userInfo: Auth0UserProfile, idToken: string, isNewUser: boolean) => {
  let authData: API.User = {
    token: idToken,
    name: userInfo.name,
    nickname: userInfo.nickname,
    picture: userInfo.picture,
    isNewUser,
    userId: userInfo.user_id,
    updatedAt: userInfo.updated_at,
    identities: userInfo.identities,
    sub: userInfo.sub,
    userName: userInfo.username,
    givenName: userInfo.given_name,
    familyName: userInfo.family_name,
    email: userInfo.email,
    isEmailVerified: userInfo.email_verified,
    gender: userInfo.gender,
    locale: userInfo.locale,
    createdAt: userInfo.created_at,
    userMetadata: userInfo.user_metadata,
    appMetadata: userInfo.app_metadata,
  };
  authData = omitBy(authData, (val) => typeof val === 'undefined') as API.User;
  return authData;
};
