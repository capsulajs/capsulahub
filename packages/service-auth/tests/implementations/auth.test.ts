import { Auth } from '../../src/AuthService';
import { mockLock } from '../helpers/utils';

describe('Auth', () => {
  const authOptions = { domain: 'domain', clientId: 'clientId' };
  const authData = {
    token: 'idtoken',
    name: 'test user',
    nickname: 'test nickname',
    picture: 'picture.src',
    isNewUser: false,
    userId: 'userId',
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString(),
    identities: [
      {
        connection: 'test connection',
        isSocial: true,
        provider: 'google',
        user_id: 'userId',
      },
    ],
    sub: 'test sub',
  };

  it('Calling init method with a valid request when user has previously an auth session', (done) => {
    expect.assertions(3);
    mockLock({ authData });

    const auth = new Auth(authOptions);
    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual(authData);
    });
    expect(auth.init({})).resolves.toEqual(authData);

    setTimeout(() => {
      expect(updates).toBe(1);
      done();
    });
  });

  it("Calling init method with a valid request when user wasn't previously authenticated", (done) => {
    expect.assertions(3);
    mockLock({ authData: {} });

    const auth = new Auth(authOptions);
    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual({});
    });
    expect(auth.init({})).resolves.toEqual({});

    setTimeout(() => {
      expect(updates).toBe(1);
      done();
    });
  });
});
