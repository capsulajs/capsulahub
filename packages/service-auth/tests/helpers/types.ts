import { Subject } from 'rxjs';
import { Auth0Error } from 'auth0-js';
import { API } from '../../src';

export type LockEventType = 'show' | 'hide' | 'authenticated' | 'unrecoverable_error' | 'signin ready' | 'signup ready';

export interface LockEvent {
  type: LockEventType;
  data: object;
}

export interface Auth0LockMockOptions {
  events$?: Subject<LockEvent>;
  authData?: API.AuthStatus;
  isNewSession?: boolean;
  checkSessionError?: Auth0Error | null;
  getUserInfoError?: Auth0Error | null;
}
