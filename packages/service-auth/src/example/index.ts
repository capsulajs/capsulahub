import { Auth } from '../AuthService';

const auth = new Auth({
  domain: 'dev-f8nw441q.auth0.com',
  clientId: 'RS6FSurmbVq9B31sJ57Px4NZpcdyCnHQ',
});

// @ts-ignore
window.auth = auth;

auth
  .authStatus$({})
  .subscribe(
    (authStatus) => console.info('authStatus$ => ', authStatus),
    (error) => console.error('authStatus$ error => ', error)
  );
