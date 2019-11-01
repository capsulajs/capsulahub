## Auth service

The purpose of this service is to provide a utility tool that allows user to implement authentication logic using [auth0](https://auth0.com/) service.

Take a look at **[Lock.js](https://auth0.com/docs/libraries/lock/v11/configuration)** documentation in order to get the whole list of **lockOptions**.

## Usage

```javascript
// You should call init as soon as possible in order to get the current auth status of a user
// If you call login method before init, login popup will not be shown until init resolves

authService.init({}).then((authStatusDataAfterInit) => {
  if (!authStatusDataAfterInit.token) {
    return authStatusDataAfterInit.login({}).then((authStatusDataAfterLogin) => {
      console.info(authStatusDataAfterLogin);
    })
  }
});
```

## Install

### NPM

To install the package from NPM registry you should run

    yarn add @capsulajs/capsulahub-service-auth

or

    npm install @capsulajs/capsulahub-service-auth

### CDN

You can get the default export from the link

    https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-auth/index.js

## WorkspaceConfiguration example

```json
{
  "services": [
    {
      "serviceName": "AuthService",
      "path": "https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-auth/index.js",
      "definition": {
        "serviceName": "AuthService",
        "methods": {
          "init": { "asyncModel": "requestResponse" },
          "login": { "asyncModel": "requestResponse" },
          "logout": { "asyncModel": "requestResponse" },
          "authStatus$": { "asyncModel": "requestStream" }
        }
      },
      "config": {
        "serviceName": "AuthService",
        "domain": "dev-f8nw441q.auth0.com",
        "clientId": "RS6FSurmbVq9B31sJ57Px4NZpcdyCnHQ"
      }
    }
  ]
}
```

## Exports

### Default

Bootstrap function of the extension.

### Named (API)

The public API of the extension.

## API

### CDN

[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-auth/doc/index.html)

### Local

Run 

```bash
yarn doc
```

And open [doc/index.html](./doc/index.html) in browser.

## Test

`npm run test` or `yarn test`

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.

## [Back to the Main Page](../../README.md)
