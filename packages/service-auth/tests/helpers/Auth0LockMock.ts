import { Observable, empty } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Auth0Error, Auth0UserProfile } from 'auth0-js';
import { API } from '../../src';
import { LockEvent, Auth0LockMockOptions, LockEventType } from './types';

export class Auth0LockMock {
  private events$: Observable<LockEvent>;
  private authData: API.AuthStatus;
  constructor({ events$ = empty(), authData = {} }: Auth0LockMockOptions) {
    this.events$ = events$;
    this.authData = authData;
  }

  public on(eventType: LockEventType, callback: (eventData: object) => void) {
    this.events$.pipe(filter((event) => event.type === eventType)).subscribe((event) => {
      callback(event.data);
    });
  }

  public checkSession(_: object, callback: (error: Auth0Error | null, profile?: AuthResult) => void) {
    if ('token' in this.authData) {
      const authResult = {
        accessToken: 'accessToken',
        expiresIn: Date.now() + 360000,
        idToken: this.authData.token,
        idTokenPayload: {
          aud: 'aud',
          exp: Date.now() + 360000,
          iat: Date.now() + 360000,
          iss: 'iss',
          sub: 'sub',
        },
        state: 'state',
        tokenType: 'tokenType',
      };
      callback(null, authResult);
    } else {
      callback({
        error: 'login_required',
        code: 'login_required',
      });
    }
  }

  public getUserInfo(_: string, callback: (error: Auth0Error | null, profile: Auth0UserProfile) => void) {
    const profile = {
      name: (this.authData as API.User).name,
      nickname: (this.authData as API.User).nickname,
      picture: (this.authData as API.User).picture,
      user_id: (this.authData as API.User).userId,
      username: (this.authData as API.User).userName,
      given_name: (this.authData as API.User).givenName,
      family_name: (this.authData as API.User).familyName,
      email: (this.authData as API.User).email,
      email_verified: (this.authData as API.User).isEmailVerified,
      clientID: 'clientID',
      gender: (this.authData as API.User).gender,
      locale: (this.authData as API.User).locale,
      identities: (this.authData as API.User).identities,
      created_at: (this.authData as API.User).createdAt!,
      updated_at: (this.authData as API.User).updatedAt,
      sub: (this.authData as API.User).sub,
    };
    return callback(null, profile);
  }
}
