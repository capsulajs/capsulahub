import { User } from '.';

/**
 * Auth status will include the information of a user, if a user is authorized, or an empty object, if he's not
 */
export type AuthStatus = User | {};
