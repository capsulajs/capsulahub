import { Auth0LockMockOptions } from './types';
import * as utils from '../../src/helpers/utils';
import { Auth0LockMock } from './Auth0LockMock';
import { auth0PopupId } from './consts';
import { API } from '../../src';

export const mockLock = (options: Auth0LockMockOptions) => {
  // @ts-ignore
  utils.createLock = jest.fn(() => {
    return new Auth0LockMock(options);
  });
};

export const getLoginPopupVisibility = () => {
  const popupEl = document.getElementById(auth0PopupId);
  if (typeof popupEl === 'object' && !popupEl) {
    return false;
  } else if (popupEl instanceof HTMLDivElement) {
    return true;
  }
};

export const mapAuthDataToLockProfile = (authData: API.User) => {
  return {
    name: authData.name,
    nickname: authData.nickname,
    picture: authData.picture,
    user_id: authData.userId,
    username: authData.userName,
    given_name: authData.givenName,
    family_name: authData.familyName,
    email: authData.email,
    email_verified: authData.isEmailVerified,
    clientID: 'clientID',
    gender: authData.gender,
    locale: authData.locale,
    identities: authData.identities,
    created_at: authData.createdAt!,
    updated_at: authData.updatedAt,
    sub: authData.sub,
  };
};

export const checkAtTestEnd = (runExpectation: () => any, timeoutToWait: number = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        runExpectation();
        resolve();
      } catch (error) {
        reject(error);
      }
    }, timeoutToWait);
  });
};
