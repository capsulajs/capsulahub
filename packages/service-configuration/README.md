# Configuration service extension for CapsulaHub

Service that you can use for managing different configurations across your projects.
Configuration service gives you possibility to easily manage your configurations.

## API

- [createRepository()](#createRepository--api)

- [delete()](#delete--api)

- [entries()](#entries-api)

- [fetch()](#fetch--api)

- [save()](#save--api)

- [More](https://github.com/capsulajs/configuration-service/blob/develop/src/api/ConfigurationServiceTypes.ts)

## Usage

```bash
yarn add @capsulajs/capsulahub-core-workspace @capsulajs/capsulahub-extensions-configuration
```

```javascript
# ./config.js

module.exports = {
  name: 'my-app',
  services: [
    {
      serviceName: 'configurationService',
      path: 'https://configuration-service-http.genesis.om2.com',
      definition: {
        serviceName: 'ConfigurationService',
        methods: {
          createRepository: { asyncModel: 'CreateRepositoryResponse' },
          delete: { asyncModel: 'DeleteResponse' },
          entries: { asyncModel: 'EntriesResponse' },
          fetch: { asyncModel: 'FetchResponse' },
          save: { asyncModel: 'SaveResponse' },
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
