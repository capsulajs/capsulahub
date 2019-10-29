import * as utils from '../../src/helpers/utils';
import { Auth0LockMock } from '../helpers/Auth0LockMock';
import { Auth } from '../../src/AuthService';

describe('Auth', () => {
  const authOptions = { domain: 'domain', clientId: 'clientId' };
  const authData = {
    token: 'idtoken',
    name: 'test user',
    nickname: 'user nickname',
    picture: 'picture.src',
    updatedAt: new Date().toDateString(),
    isNewUser: false,
  };

  it('Calling init method with a valid request when user has previously an auth session', () => {
    expect.assertions(2);
    // @ts-ignore
    utils.createLock = jest.fn(() => {
      return new Auth0LockMock({ authData });
    });

    const auth = new Auth(authOptions);

    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      expect(++updates).toBe(1);
      expect(authStatusData).toEqual(authData);
    });

    expect(auth.init({})).resolves.toEqual(authData);
  });
});
