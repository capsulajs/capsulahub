import { Auth0Error } from 'auth0-js';
import { Observable } from 'rxjs';

export interface PromiseWithFinallyStreamCallbackData {
  resolve: (...args: any[]) => void;
  reject: (err: Auth0Error) => void;
  isPromiseFinally$: Observable<boolean>;
}
