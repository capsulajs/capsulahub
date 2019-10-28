import { Auth } from '../AuthService';

const auth = new Auth({
  domain: 'dev-f8nw441q.auth0.com',
  clientId: 'RS6FSurmbVq9B31sJ57Px4NZpcdyCnHQ',
});

auth.authStatus$({}).subscribe((authStatus) => {
  console.log('authStatus', authStatus);
});

auth.login({}).then((loginRes) => {
  console.log('loginRes', loginRes);
});
