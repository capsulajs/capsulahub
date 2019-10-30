import { ReplaySubject, Subject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Auth0Error } from 'auth0-js';
import { API } from './index';
import { createLock, mapUserInfoToAuthData } from './helpers/utils';

interface PromiseWithFinallyStreamCallbackData {
  resolve: (...args: any[]) => void;
  reject: (err: any) => void;
  isPromiseFinally$: Observable<boolean>;
}

const modalTabs = {
  signIn: 'signIn' as 'signIn',
  signUp: 'signUp' as 'signUp',
};

export class Auth implements API.AuthService {
  private lock: Auth0LockStatic;
  private modalVisibilitySubject$: Subject<boolean>;
  private authStatusSubject$: ReplaySubject<API.AuthStatus> = new ReplaySubject(1);
  private unrecoverableErrorSubject$: ReplaySubject<Auth0Error> = new ReplaySubject(1);
  private errorsSubject$: Subject<Auth0Error> = new Subject();
  private modalTabLastShown?: 'signIn' | 'signUp';

  constructor(options: Pick<API.AuthServiceConfig, 'domain' | 'clientId'>) {
    this.lock = createLock(options);
    this.modalVisibilitySubject$ = new Subject();
    this.lock.on('show', () => {
      this.modalVisibilitySubject$.next(true);
    });
    this.lock.on('hide', () => {
      this.modalVisibilitySubject$.next(false);
    });
    this.lock.on('authenticated', (authResult) => {
      this.handleAuthResult(authResult).catch((error) => {
        this.errorsSubject$.next(error);
      });
    });
    this.lock.on('unrecoverable_error', (error) => {
      this.unrecoverableErrorSubject$.next(error);
      this.authStatusSubject$.error(error);
    });
    this.lock.on('signin ready', () => {
      this.modalTabLastShown = modalTabs.signIn;
    });
    this.lock.on('signup ready', () => {
      this.modalTabLastShown = modalTabs.signUp;
    });
  }

  public init({}) {
    return this.createPromise<API.AuthStatus>(({ resolve, reject }) => {
      this.lock.checkSession({}, (error, authResult) => {
        if (error) {
          if (error.code === 'login_required') {
            this.handleAuthResult(undefined).then(resolve);
          } else {
            reject(error);
          }
        } else {
          this.handleAuthResult(authResult).then(resolve);
        }
      });
    });
  }

  public login({}) {
    return this.createPromise<API.User>(({ resolve, reject, isPromiseFinally$ }) => {
      this.errorsSubject$.pipe(takeUntil(isPromiseFinally$)).subscribe((error) => reject(error));

      this.modalVisibilitySubject$
        .pipe(
          filter((isModalVisible) => !isModalVisible),
          takeUntil(isPromiseFinally$)
        )
        .subscribe(() => reject('Login modal has been closed'));

      let authStatusEmits = 0;
      this.authStatusSubject$.pipe(takeUntil(isPromiseFinally$)).subscribe((authStatus) => {
        if (++authStatusEmits === 1) {
          if ('token' in authStatus) {
            reject('User has been already signed up');
          } else {
            this.lock.show();
          }
        } else if ('token' in authStatus) {
          this.closeModal();
          resolve(authStatus);
        }
      });
    });
  }

  public logout({}): Promise<void> {
    return this.createPromise<void>(({ resolve }) => {
      this.lock.logout({ returnTo: '' });
      resolve();
    });
  }

  public authStatus$({}) {
    return this.authStatusSubject$.asObservable();
  }

  private handleAuthResult(authResult: AuthResult | undefined) {
    return new Promise((resolve, reject) => {
      if (authResult) {
        this.lock.getUserInfo(authResult.accessToken, (error, userInfo) => {
          if (error) {
            reject(error);
          } else {
            const authData = mapUserInfoToAuthData(
              userInfo,
              authResult.idToken,
              this.modalTabLastShown === modalTabs.signUp
            );
            this.authStatusSubject$.next(authData);
            resolve(authData);
          }
        });
      } else {
        this.authStatusSubject$.next({});
        resolve({});
      }
    });
  }

  private createPromise<T>(callback: (data: PromiseWithFinallyStreamCallbackData) => void): Promise<T> {
    const isPromiseFinally$ = new Subject<boolean>();
    return new Promise<T>((resolve, reject) => {
      this.unrecoverableErrorSubject$.pipe(takeUntil(isPromiseFinally$)).subscribe((error) => reject(error));
      callback({ resolve, reject, isPromiseFinally$: isPromiseFinally$.asObservable() });
    }).finally(() => isPromiseFinally$.next(true));
  }

  private closeModal = () => {
    this.modalTabLastShown = undefined;
    this.lock.hide();
  };
}
