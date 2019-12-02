export const errors = {
  isAlreadyAuth: { error: 'already_auth', description: 'A user has been already authorized' },
  isAlreadyOpenedLoginPopup: { error: 'already_opened_login_popup', description: 'A login popup is already opened' },
  loginCanceled: { error: 'login_canceled', description: 'A user has canceled authorization process' },
  isNotAuth: { error: 'is_not_auth', description: 'A user is not authorized' },
  invalidServiceName: '"ServiceName" should be a non-empty string',
  invalidDomain: '"Domain" should be a non-empty string',
  invalidClientId: '"ClientId" should be a non-empty string',
  invalidLockOptions: '"lockOptions" should be an object with objects for "auth0-lock" library',
};
