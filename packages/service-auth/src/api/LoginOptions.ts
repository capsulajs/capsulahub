/**
 * THe options for the "login" method of AuthService
 */
export interface LoginOptions {
  /**
   * The mode, that will be applied by auth0 after triggering the login
   * In case of "popup" the new popup with auth logic will appear in the app
   * In case of "redirect" the app will be redirected to a new page with auth logic - after a user completes with
   * auth process he will be redirected back to the original app
   * @default 'popup'
   */
  mode?: 'popup' | 'redirect';
}
