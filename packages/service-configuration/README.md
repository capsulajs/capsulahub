# Configuration service extension for CapsulaHub

Service that you can use for managing different configurations across your projects.
Configuration service gives you possibility to easily manage your configurations.

## Install

### NPM

To install the package from NPM registry you should run

```
yarn add @capsulajs/capsulahub-service-configuration
```

or
```
npm install @capsulajs/capsulahub-service-configuration
```

### CDN

You can get the default export from the link

```
https://capsulajs.s3.amazonaws.com/develop/service-configuration/index.js
```

## API

- [createRepository()](#createRepository--api)

- [delete()](#delete--api)

- [entries()](#entries-api)

- [fetch()](#fetch--api)

- [save()](#save--api)

- [More](https://github.com/capsulajs/configuration-service/blob/develop/src/api/ConfigurationServiceTypes.ts)

## Usage

```javascript
# ./config.js

module.exports = {
  name: 'my-app',
  services: [
    {
      serviceName: 'ConfigurationService',
      path: 'https://capsulajs.s3.amazonaws.com/develop/service-configuration/index.js',
      definition: {
        serviceName: 'ConfigurationService',
        methods: {
          createRepository: { asyncModel: 'requestResponse' },
          delete: { asyncModel: 'requestResponse' },
          entries: { asyncModel: 'requestResponse' },
          fetch: { asyncModel: 'requestResponse' },
          save: { asyncModel: 'requestResponse' },
        }
      },
      config: {
        provider: 'http'
      }
    },
  ],
  components: {}
};
```

## Options

Use different configuration providers to manage your configurations over remote service, localStorage, file, etc.
For RemoteProvider you should probide dispatcher as well.

Possible providers [More](https://github.com/capsulajs/configuration-service/tree/develop/src/provider):

- RemoteProvider
- LocalStorageProvider
- FileProvider
- HttpProvider

Default provider:

- FileProvider

Use different transport providers to setup communication over http or web sockets.

Possible dispatchers [More](https://github.com/capsulajs/capsulajs-transport-providers):

- AxiosDispatcher
- WebSocketDispatcher

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.
