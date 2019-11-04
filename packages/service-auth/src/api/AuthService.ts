import { Observable } from 'rxjs';
import { User, AuthStatus } from '.';

/**
 * AuthService is responsible for:
 * - Triggering the signUp/signIn, logout processes using "auth0" service
 * - Providing the stream of a current login status
 */
export interface AuthService {
  /**
   * The method, that is responsible for restoring the last auth session of a user (if it exists)
   * After it has checked for the auth session, authStatus$ will emit the first time
   * @returns A promise, that resolves with a current auth status
   */
  init(initOptions: {}): Promise<AuthStatus>;
  /**
   * The method, that is responsible for triggering the signUp/signIn logic of "auth0"
   * @returns A promise, that resolves with user data, when a user is successfully authorized
   */
  login(loginOptions: {}): Promise<User>;
  /**
   * The method, that is responsible for triggering the logout logic of "auth0"
   * @returns A promise, that resolves with void, when a user is successfully logged out
   */
  logout(logoutOptions: { returnTo?: string }): Promise<void>;
  /**
   * The method, that is responsible for providing updates about the current auth status
   * @returns An observable, that emits new value each time, when auth status is changed
   */
  authStatus$(authStatusOptions: {}): Observable<AuthStatus>;
}
