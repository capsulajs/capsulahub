import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Auth0Error, Auth0UserProfile } from 'auth0-js';
import { API } from '../../src';
import { LockEvent, Auth0LockMockOptions, LockEventType } from './types';
import { auth0PopupId } from './consts';
import { mapAuthDataToLockProfile } from './utils';

export class Auth0LockMock {
  private events$: Subject<LockEvent>;
  private authData: API.AuthStatus;
  private isNewSession: boolean;
  private checkSessionError: Auth0Error | null;
  private getUserInfoError: Auth0Error | null;
  constructor({
    events$ = new Subject<LockEvent>(),
    authData = {},
    isNewSession = true,
    checkSessionError = null,
    getUserInfoError = null,
  }: Auth0LockMockOptions) {
    this.events$ = events$;
    this.authData = authData;
    this.isNewSession = isNewSession;
    this.checkSessionError = checkSessionError;
    this.getUserInfoError = getUserInfoError;
  }

  public on(eventType: LockEventType, callback: (eventData: object) => void) {
    this.events$.pipe(filter((event) => event.type === eventType)).subscribe((event) => {
      callback(event.data);
    });
  }

  public checkSession(_: object, callback: (error: Auth0Error | null, profile?: AuthResult) => void) {
    if (this.checkSessionError) {
      callback(this.checkSessionError);
    } else if (!this.isNewSession) {
      const authResult = {
        accessToken: 'accessToken',
        expiresIn: Date.now() + 360000,
        idToken: (this.authData as API.User).token,
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
    return callback(this.getUserInfoError, mapAuthDataToLockProfile(this.authData as API.User));
  }

  public show() {
    const popup = document.createElement('div');
    popup.textContent = 'Auth0 Popup';
    popup.id = auth0PopupId;
    document.body.appendChild(popup);
    this.events$.next({ type: 'show', data: {} });
    this.events$.next({ type: 'signin ready', data: {} });
  }

  public hide() {
    document.getElementById(auth0PopupId)!.remove();
  }

  public logout() {
    return true;
  }
}
