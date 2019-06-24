[![Build Status](https://travis-ci.com/capsulajs/capsulahub.svg?branch=develop)](https://travis-ci.com/capsulajs/capsulahub)

# Capsula Hub

## Description

An awesome tool to develop and test your micro-frontend services !

## Local development
```bash
yarn link
chmod +x lib/cli.js
capsulahub run --token=http://localhost:3000/configuration --configProvider=httpFile --port=8888
```

## Install

In your project, run `$ npm install --save-dev @capsulajs/capsula-hub` or `$ yarn add -D @capsulajs/capsula-hub`.
If you want to use `capsulahub` command directly, you can install it globally.

## Usage

```shell
capsula-hub run [options]

Options:
  -l, --local <path-to-file>  Run with local configuration file
  -p, --port <port>           Run on specified port (default 55555)
```

## Configuration

The configuration should be a `js` file that exports an `object` which
match this [API](https://github.com/capsulajs/capsulahub-core/blob/develop/packages/workspace/src/api/WorkspaceConfig.ts).

Example: _config.js_

```javascript
module.exports = {
  name: 'my-app',
  services: [
    {
      serviceName: 'myServiceA',
      path: 'https://my-cdn/my-service-a',
      definition: {
        serviceName: 'myServiceA',
        methods: {
          myMethod1: { asyncModel: 'RequestResponse' },
          myMethod2$: { asyncModel: 'RequestStream' },
        }
      },
      config: {}
    },
    {
      serviceName: 'myServiceB',
      path: 'https://my-cdn/my-service-b',
      definition: {
        serviceName: 'myServiceB',
        methods: {
          myMethod1: { asyncModel: 'RequestResponse' },
          myMethod2: { asyncModel: 'RequestResponse' },
        }
      },
      config: {}
    },
  ],
  components: {
    layouts: {
      grid: {
        componentName: 'my-grid',
        path: 'http://my-cdn/components/Grid.js',
        config: { title: 'Base Grid' },
       },
    },
    items: {
      myItem: {
        componentName: 'my-item',
        path: 'http://my-cdn/components/myItem.js',
        config: { title: 'Base Item' },
      },
    }
  }
};
```

## Develop your extension

An extension is a service or a web component that is loaded by CapsulaHub. 
The extension should look like this:

```typescript
import { Workspace } from '@capsulajs/capsulahub-core-workspace';
export default (workspace: Workspace, config: object): Promise<void> => {
  // your code here
};
```

`workspace` and `config` are injected by the application in the extension.

`workspace` is matching this [API](https://github.com/capsulajs/capsulahub-core/blob/develop/packages/workspace/src/api/Workspace.ts) 
and could be use in particular to allow the service to register itself.

`config` contains the configuration for this specific extension that you passed in the configuration file 
(e.g: `configuration_file.services.['myExtension'].config` for myExtension service).

For more details, take a look at this 
[example file](https://github.com/capsulajs/capsulahub-core/blob/develop/packages/externalModules/src/services/serviceA.ts).

<!-- To put back later for local dev
Run it locally
--------------
|        What to do    |   Command   |
|----------------------|-------------|
| To run the linter:   | `yarn lint` |
| To run the tests:    | `yarn test` |
| To generate the doc: | `yarn doc`  |


Development
-----------
- Clone the project then do `yarn` or `npm i`
- Create a `capsulahub.json` file at the root with the following structure:
    ```json
    {
      "token": "your_token"
    }
    ```
- Run `yarn start` or `npm run start`.
-->

## License

[CapsulaHub](https://github.com/capsulajs/capsula-hub) is released under [MIT License](./LICENSE).
