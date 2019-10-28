import { ReplaySubject } from 'rxjs';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { API } from '.';

export class Auth implements API.AuthService {
  private auth0: Promise<Auth0Client>;
  private authStatusSubject$: ReplaySubject<API.AuthStatus> = new ReplaySubject(1);

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

  public async login(_: {}) {
    const auth = await this.auth0;
    try {
      await auth.loginWithPopup();
    } catch (error) {
      console.log('login error', error);
    }
    return this.authUser({ auth });
  }

  public async logout(_: {}) {
    const auth = await this.auth0;
    await auth.logout();
    this.authStatusSubject$.next({});
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
