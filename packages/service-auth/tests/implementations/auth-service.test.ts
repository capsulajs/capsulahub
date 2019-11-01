import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { Auth } from '../../src/AuthService';
import { mockLock, getLoginPopupVisibility, checkAtTestEnd } from '../helpers/utils';
import { errors } from '../../src/helpers/consts';
import { LockEvent } from '../helpers/types';
import { mapUserInfoToAuthData } from '../../src/helpers/utils';
import { API } from '../../src';

describe('AuthService tests', () => {
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
  const checkSessionError = { error: 'check_session_error' };
  const getUserInfoError = { error: 'get_user_info_error' };
  const criticalError = { error: 'critical_error' };
  const events$ = new Subject<LockEvent>();
  const lockMockIsDestroyed$ = events$.pipe(
    filter(({ type }) => type === 'destroy'),
    take(1)
  );
  const getAuthStatusStream = (auth: API.AuthService) => auth.authStatus$({}).pipe(takeUntil(lockMockIsDestroyed$));

  afterEach(() => {
    events$.next({ type: 'destroy', data: {} });
  });

  it('Calling init method with a valid request when user has previously an auth session', () => {
    expect.assertions(3);
    mockLock({ authData, isNewSession: false, events$ });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual(authData);
    });
    expect(auth.init({})).resolves.toEqual(authData);
    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it("Calling init method with a valid request when user hasn't previously an auth session", () => {
    expect.assertions(3);
    mockLock({ authData: {}, isNewSession: true });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual({});
    });
    expect(auth.init({})).resolves.toEqual({});
    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it('Calling init method with a valid request and a server error occurs (while checking session and getting user data)', () => {
    expect.assertions(4);
    // checkSessionError
    mockLock({ checkSessionError, authData, isNewSession: false });
    const auth1 = new Auth(authOptions);
    let updates1 = 0;
    let updates2 = 0;
    getAuthStatusStream(auth1).subscribe(() => {
      updates1++;
    });
    expect(auth1.init({})).rejects.toEqual(checkSessionError);
    // getUserInfoError
    mockLock({ getUserInfoError, authData, isNewSession: false });
    const auth2 = new Auth(authOptions);
    getAuthStatusStream(auth2).subscribe(() => {
      updates2++;
    });
    expect(auth2.init({})).rejects.toEqual(getUserInfoError);
    return checkAtTestEnd(() => {
      expect(updates1).toBe(0);
      expect(updates2).toBe(0);
    });
  });

  it('Calling init method with a valid request and a critical error occurs while init is in pending state', () => {
    expect.assertions(2);
    mockLock({ authData, isNewSession: true, events$ });
    const auth = new Auth(authOptions);

    const authStatusErrorReceived = new Promise((resolve) => {
      getAuthStatusStream(auth).subscribe({
        error: (error) => {
          expect(error).toEqual(criticalError);
          resolve();
        },
      });
    });
    const initRes = auth.init({});
    events$.next({ type: 'unrecoverable_error', data: criticalError });

    return Promise.all([authStatusErrorReceived, expect(initRes).rejects.toEqual(criticalError)]);
  });

  it('Calling login method when user has previously an auth session and init promise is in a pending state', () => {
    expect.assertions(5);
    mockLock({ authData, isNewSession: false });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual(authData);
    });
    expect(auth.init({})).resolves.toEqual(authData);
    expect(auth.login({})).rejects.toEqual(errors.isAlreadyAuth);
    return checkAtTestEnd(() => {
      expect(getLoginPopupVisibility()).toBe(false);
      expect(updates).toBe(1);
    });
  });

  it("Calling login method when user hasn't previously an auth session and init promise is in a pending state", () => {
    expect.assertions(7);
    mockLock({ authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((authStatusData) => {
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
    return checkAtTestEnd(() => expect(updates).toBe(2));
  });

  it('Calling login method with a valid request when user is authenticated', () => {
    expect.assertions(5);
    mockLock({ authData, isNewSession: false });

    const auth = new Auth(authOptions);
    let updates = 0;
    auth.authStatus$({}).subscribe((authStatusData) => {
      updates++;
      expect(authStatusData).toEqual(authData);
    });
    expect(auth.init({}))
      .resolves.toEqual(authData)
      .then(() => expect(auth.login({})).rejects.toEqual(errors.isAlreadyAuth));

    return checkAtTestEnd(() => {
      expect(getLoginPopupVisibility()).toBe(false);
      expect(updates).toBe(1);
    });
  });

  const runLoginSuccessCase = (isNewUser: boolean) => {
    expect.assertions(7);
    const authDataForNewlyAuthUser = { ...authData, isNewUser };
    mockLock({ authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((authStatusData) => {
      updates++;
      if (updates === 1) {
        expect(authStatusData).toEqual({});
      }
      if (updates === 2) {
        expect(authStatusData).toEqual(authDataForNewlyAuthUser);
      }
    });
    expect(auth.init({}))
      .resolves.toEqual({})
      .then(() => {
        auth.login({}).then((res) => {
          expect(res).toEqual(authDataForNewlyAuthUser);
          expect(getLoginPopupVisibility()).toBe(false);
        });
        expect(getLoginPopupVisibility()).toBe(true);
        events$.next({ type: `sign${isNewUser ? 'up' : 'in'} ready` as 'signup ready' | 'signin ready', data: {} });
        events$.next({ type: 'authenticated', data: authResult });
      });

    return checkAtTestEnd(() => expect(updates).toBe(2));
  };

  it('Calling login method with a valid request when user is not authenticated and authorizes through sign in', () => {
    return runLoginSuccessCase(false);
  });

  it('Calling login method with a valid request when user is not authenticated and authorizes through sign up', () => {
    return runLoginSuccessCase(true);
  });

  it('Calling login method with a valid request and a server error occurs while getting user data', () => {
    expect.assertions(6);
    mockLock({ getUserInfoError, authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((res) => {
      updates++;
      expect(res).toEqual({});
    });

    expect(auth.init({}))
      .resolves.toEqual({})
      .then(() => {
        auth.login({}).catch((error) => {
          expect(error).toEqual(getUserInfoError);
          expect(getLoginPopupVisibility()).toBe(false);
        });
        expect(getLoginPopupVisibility()).toBe(true);
        events$.next({ type: 'authenticated', data: authResult });
      });

    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it('Calling login method with a valid request and a critical error occurs', () => {
    expect.assertions(7);
    mockLock({ authData, isNewSession: true, events$ });
    const auth = new Auth(authOptions);

    let updates = 0;
    const authStatusErrorReceived = new Promise((resolve) => {
      getAuthStatusStream(auth).subscribe({
        next: (res) => {
          updates++;
          expect(res).toEqual({});
        },
        error: (error) => {
          expect(updates).toBe(1);
          expect(error).toEqual(criticalError);
          resolve();
        },
      });
    });

    let loginRes;

    return Promise.all([
      authStatusErrorReceived,
      auth
        .init({})
        .then((res) => expect(res).toEqual({}))
        .then(() => {
          loginRes = auth.login({});
          expect(getLoginPopupVisibility()).toBe(true);
          events$.next({ type: 'unrecoverable_error', data: criticalError });
          return expect(loginRes).rejects.toEqual(criticalError);
        })
        .then(() => expect(getLoginPopupVisibility()).toBe(false)),
    ]);
  });

  it('Closing auth0 modal when login promise is in a pending state', () => {
    expect.assertions(5);
    mockLock({ authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((res) => {
      updates++;
      expect(res).toEqual({});
    });

    expect(auth.init({}))
      .resolves.toEqual({})
      .then(() => {
        auth.login({}).catch((error) => {
          expect(error).toEqual(errors.loginCanceled);
        });
        expect(getLoginPopupVisibility()).toBe(true);
        events$.next({ type: 'hide', data: {} });
      });

    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it('Calling logout method with a valid request when user is authenticated', () => {
    expect.assertions(5);
    mockLock({ authData, isNewSession: false });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((res) => {
      updates++;
      if (updates === 1) {
        expect(res).toEqual(authData);
      }
      if (updates === 2) {
        expect(res).toEqual({});
      }
    });

    auth
      .init({})
      .then((res) => expect(res).toEqual(authData))
      .then(() => auth.logout({}))
      .then((res) => expect(res).toEqual(undefined));
    return checkAtTestEnd(() => expect(updates).toBe(2));
  });

  it('Calling logout method with a valid request when user is not authenticated', () => {
    expect.assertions(4);
    mockLock({ authData, isNewSession: true });

    const auth = new Auth(authOptions);
    let updates = 0;
    getAuthStatusStream(auth).subscribe((res) => {
      updates++;
      expect(res).toEqual({});
    });

    auth
      .init({})
      .then((res) => expect(res).toEqual({}))
      .then(() => auth.logout({}))
      .catch((error) => expect(error).toEqual(errors.isNotAuth));
    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it('Calling AuthService methods when a critical error from auth0 occurs', () => {
    expect.assertions(4);
    mockLock({ authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);
    events$.next({ type: 'unrecoverable_error', data: criticalError });

    const authStatusErrorReceived = new Promise((resolve) => {
      getAuthStatusStream(auth).subscribe({
        error: (error) => {
          expect(error).toEqual(criticalError);
          resolve();
        },
      });
    });
    return Promise.all([
      authStatusErrorReceived,
      expect(auth.init({})).rejects.toEqual(criticalError),
      expect(auth.login({})).rejects.toEqual(criticalError),
      expect(auth.logout({})).rejects.toEqual(criticalError),
    ]);
  });

  it('Calling login method when auth0 modal is opened', () => {
    expect.assertions(6);
    mockLock({ authData, isNewSession: true, events$ });

    const auth = new Auth(authOptions);

    let updates = 0;
    getAuthStatusStream(auth).subscribe((res) => {
      updates++;
      expect(res).toEqual({});
    });

    expect(auth.init({}))
      .resolves.toEqual({})
      .then(() => {
        auth.login({});
        expect(getLoginPopupVisibility()).toBe(true);
        expect(auth.login({}))
          .rejects.toEqual(errors.isAlreadyOpenedLoginPopup)
          .then(() => expect(getLoginPopupVisibility()).toBe(true));
      });
    return checkAtTestEnd(() => expect(updates).toBe(1));
  });

  it('userProfile has been mapped correctly to authData (unit test)', () => {
    expect.assertions(1);
    const updatedAt = new Date().toDateString();
    const createdAt = new Date(Date.now() - 3600).toDateString();
    const userProfile = {
      name: 'userName',
      nickname: 'userNickname',
      picture: 'userPicture',
      user_id: 'unique_user_id',
      clientID: 'someClientId',
      updated_at: updatedAt,
      identities: [],
      sub: 'userSub',
      username: 'userName',
      given_name: 'givenName',
      family_name: 'familyName',
      email: 'someemail@gmail.com',
      email_verified: true,
      gender: 'male',
      locale: 'some locale',
      created_at: createdAt,
      user_metadata: {
        test: 555,
      },
      app_metadata: {
        hello: 'world',
      },
    };
    expect(mapUserInfoToAuthData(userProfile, 'idToken', true)).toEqual({
      token: 'idToken',
      name: 'userName',
      nickname: 'userNickname',
      picture: 'userPicture',
      isNewUser: true,
      userId: 'unique_user_id',
      updatedAt,
      identities: [],
      sub: 'userSub',
      userName: 'userName',
      givenName: 'givenName',
      familyName: 'familyName',
      email: 'someemail@gmail.com',
      isEmailVerified: true,
      gender: 'male',
      locale: 'some locale',
      createdAt,
      userMetadata: {
        test: 555,
      },
      appMetadata: {
        hello: 'world',
      },
    });
  });
});
