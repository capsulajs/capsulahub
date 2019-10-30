import { Subject } from 'rxjs';
import { Auth } from '../../src/AuthService';
import { mockLock, getLoginPopupVisibility } from '../helpers/utils';
import { errors } from '../../src/helpers/consts';
import { LockEvent } from '../helpers/types';

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
  const authResult = {
    accessToken: 'access token',
    idToken: authData.token,
    expiresIn: Date.now() + 3600,
    idTokenPayload: {
      aud: 'aud',
      exp: Date.now() + 3600,
      iat: Date.now() + 3600,
      iss: 'iss',
      sub: 'sub',
    },
    state: 'state',
    tokenType: 'Bearer',
  };

  it('Calling init method with a valid request when user has previously an auth session', (done) => {
    expect.assertions(3);
    mockLock({ authData, isNewSession: false });

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
    }, 1000);
  });

  it("Calling init method with a valid request when user wasn't previously authenticated", (done) => {
    expect.assertions(3);
    mockLock({ authData: {}, isNewSession: true });

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
    }, 1000);
  });

  it('Calling init method with a valid request and a server error occurs while getting user data', (done) => {
    expect.assertions(4);
    const checkSessionError = { error: 'check_session_error' };
    const getUserInfoError = { error: 'get_user_info_error' };
    mockLock({ checkSessionError, authData, isNewSession: false });

    const auth1 = new Auth(authOptions);
    let updates1 = 0;
    let updates2 = 0;
    auth1.authStatus$({}).subscribe(() => {
      updates1++;
    });

    expect(auth1.init({})).rejects.toEqual(checkSessionError);

    mockLock({ getUserInfoError, authData, isNewSession: false });
    const auth2 = new Auth(authOptions);
    auth2.authStatus$({}).subscribe(() => {
      updates2++;
    });
    expect(auth2.init({})).rejects.toEqual(getUserInfoError);

    setTimeout(() => {
      expect(updates1).toBe(0);
      expect(updates2).toBe(0);
      done();
    }, 1000);
  });

  it('Calling login method when user has previously an auth session and init promise is in a pending state', (done) => {
    expect.assertions(4);
    mockLock({ authData, isNewSession: false });

    const auth = new Auth(authOptions);
    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual(authData);
    });
    auth.init({}).then((res) => expect(res).toEqual(authData));
    expect(auth.login({})).rejects.toEqual(errors.isAlreadyAuth);

    setTimeout(() => {
      expect(updates).toBe(1);
      done();
    }, 1000);
  });

  it("Calling login method when user hasn't previously an auth session and init promise is in a pending state", (done) => {
    expect.assertions(7);
    const events$ = new Subject<LockEvent>();
    mockLock({ authData, isNewSession: true, events$: events$.asObservable() });

    const auth = new Auth(authOptions);
    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      updates++;
      if (updates === 1) {
        expect(authStatusData).toEqual({});
      }
      if (updates === 2) {
        expect(authStatusData).toEqual(authData);
      }
    });
    expect(auth.init({})).resolves.toEqual({});

    auth.login({}).then((res) => {
      expect(res).toEqual(authData);
      expect(getLoginPopupVisibility()).toBe(false);
    });
    expect(getLoginPopupVisibility()).toBe(true);
    events$.next({ type: 'authenticated', data: authResult });

    setTimeout(() => {
      expect(updates).toBe(2);
      done();
    }, 1000);
  });
});
