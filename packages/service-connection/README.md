## Connection service

The purpose of this service is to provide a utility tool that allows user to establish a communication a server for a provided protocol.

## Install

### NPM

To install the package from NPM registry you should run

    yarn add @capsulajs/capsulahub-service-connection

or

    npm install @capsulajs/capsulahub-service-connection

### CDN

You can get the default export from the link

    https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-connection/index.js

## WorkspaceConfiguration example

```json
{
  "services": [
    {
      "serviceName": "WebSocketConnectionService",
      "path": "https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-connection/index.js",
      "definition": {
        "serviceName": "WebSocketConnectionService",
        "methods": {
          "open": { "asyncModel": "requestResponse" },
          "close": { "asyncModel": "requestResponse" },
          "send": { "asyncModel": "requestResponse" },
          "events$": { "asyncModel": "requestStream" }
        }
      },
      "config": {
        "provider": "websocket",
        "serviceName": "WebSocketConnectionService"
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

[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-connection/doc/index.html)

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
