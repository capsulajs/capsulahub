import { Observable } from 'rxjs';
import { API } from '../../src';

export type LockEventType = 'show' | 'hide' | 'authenticated' | 'unrecoverable_error' | 'signin ready' | 'signup ready';

export interface LockEvent {
  type: LockEventType;
  data: object;
}

export interface Auth0LockMockOptions {
  events$?: Observable<LockEvent>;
  authData?: API.AuthStatus;
}
