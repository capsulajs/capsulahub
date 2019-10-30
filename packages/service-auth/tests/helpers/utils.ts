import { Auth0LockMockOptions } from './types';
import * as utils from '../../src/helpers/utils';
import { Auth0LockMock } from './Auth0LockMock';

export const mockLock = (options: Auth0LockMockOptions) => {
  // @ts-ignore
  utils.createLock = jest.fn(() => {
    return new Auth0LockMock(options);
  });
};
