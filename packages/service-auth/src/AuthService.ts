import { ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { API } from '.';

export class Auth implements API.AuthService {
  private auth0: Promise<Auth0Client>;
  private authStatusSubject$: ReplaySubject<API.AuthStatus> = new ReplaySubject(1);
  private lastLoginCallSubject$: Subject<number> = new Subject();

  constructor(options: Pick<API.AuthServiceConfig, 'domain' | 'clientId'>) {
    this.auth0 = createAuth0Client({
      domain: options.domain,
      client_id: options.clientId,
    });
  }

  public async init(_: {}) {
    const auth = await this.auth0;
    const isAuthenticated = await auth.isAuthenticated();
    if (isAuthenticated) {
      return this.authUser({ auth });
    } else {
      return {};
    }
  }

  // @ts-ignore
  public login(_: {}) {
    this.lastLoginCallSubject$.next(Date.now());
    return new Promise((resolve, reject) => {
      this.lastLoginCallSubject$.pipe(take(1)).subscribe(() => {
        reject(new Error('Login has been called again'));
      });

      let auth: Auth0Client;
      return this.auth0
        .then((auth0) => {
          auth = auth0;
          return auth.loginWithPopup(undefined, { timeoutInSeconds: 3600 });
        })
        .then(() => this.authUser({ auth }))
        .then(resolve)
        .catch((error) => {
          if (!error.message.includes('Invalid state')) {
            return reject(error);
          }
        });
    });
  }

  // @ts-ignore
  public logout(_: {}) {
    return new Promise((resolve, reject) => {
      this.authStatusSubject$.pipe(take(1)).subscribe((authStatus) => {
        if ('token' in authStatus) {
          this.auth0
            .then((auth) => auth.logout())
            .then(() => this.authStatusSubject$.next({}))
            .then(resolve)
            .catch(reject);
        } else {
          reject('A user has not been authorized yet');
        }
      });
    });
  }

  public authStatus$(_: {}) {
    return this.authStatusSubject$.asObservable();
  }

  private authUser = async ({ auth }: { auth: Auth0Client }) => {
    const userData = await auth.getIdTokenClaims();
    const authStatus = {
      token: userData.__raw,
      name: userData.name || userData.nickname || userData.email,
    };
    this.authStatusSubject$.next(authStatus);
    return authStatus;
  };
}
