/**
 * The data of an authorized user
 */
export interface User {
  /**
   * auth0 token
   */
  token: string;
  name?: string;
}
