import { Auth } from '../AuthService';

const auth = new Auth({
  domain: 'dev-f8nw441q.auth0.com',
  clientId: 'RS6FSurmbVq9B31sJ57Px4NZpcdyCnHQ',
});

// @ts-ignore
window.auth = auth;

auth.authStatus$({}).subscribe((authStatus) => {
  console.log('authStatus', authStatus);
});

auth
  .init({})
  .then((data) => {
    console.log('init data', data);
  })
  .catch((error) => {
    console.log('init error', error);
  });
