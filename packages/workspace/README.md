# Workspace
The main core service of Capsulahub, it is responsible for:
 - Loading services and components according to its configuration;
 - Allowing services to register themselves;
 - Letting services and components communicate together;
 - Exposing to the services their configuration.
 
## Usage
To install the package from NPM registry you should run
```
yarn add @capsulajs/capsulahub-workspace
```

or

```
npm install @capsulajs/capsulahub-workspace
```
 
Then you can create a Workspace as following:

```js
import WorkspaceFactory from '@capsulajs/capsulahub-workspace';

const workspaceFactory = new WorkspaceFactory();

let workspace;
workspaceFactory.createWorkspace({ 
  token: 'http://localhost:3000/configuration/workspace.json',
  configProvider: 'httpFile'
})
    .then((response) => {
      workspace = response;
      console.log('The workspace has been created', workspace)
    })
     .catch((error) => {
       console.log('an error has occurred while creating a workspace', error)
     });
```
 
## API
 
[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/workspace/doc/index.html)

## Configuration
An example of WorkspaceConfiguration:
```json
{
  "name": "baseWorkspace",
  "services": [
    {
      "serviceName": "ServiceA",
      "path": "http://localhost:3000/services/serviceA.js",
      "definition": {
        "serviceName": "ServiceA",
        "methods": {
          "greet": { "asyncModel": "requestResponse" }
        }
      },
      "config": { "name": "serviceA", "message": "what pill would you choose: red or blue?" }
    },
    {
      "serviceName": "ServiceB",
      "path": "http://localhost:3000/services/serviceB.js",
      "definition": {
        "serviceName": "ServiceB",
        "methods": {
          "getRandomNumbers": { "asyncModel": "requestStream" }
        }
      },
      "config": { "name": "serviceB" }
    }
  ],
  "components": {
    "layouts": {
      "grid": {
        "componentName": "web-grid",
        "nodeId": "root",
        "path": "http://localhost:3000/widgets/Grid.js",
        "config": { "title": "Base Grid" }
      }
    },
    "items": {
      "request-form": {
        "componentName": "web-request-form",
        "nodeId": "request-form",
        "path": "http://localhost:3000/widgets/RequestForm.js",
        "config": { "title": "Base Request Form" }
      }
    }
  }
}

```

Configuration can be changed in **[cdn](../cdn)** package in _"./src/configuration"_. The name of json file should always be **workspace.json**.

The extensions also can be changed in **[cdn](../cdn)** package (don't forget to update configuration file after creating new extensions).

## Build
```
yarn build
```
Builds **es-modules** version (in **lib** folder) for NPM and **bundle** version (in **dist** folder) for CDN.

## Example

In order to open a simple example you should run localhost:3000 with extensions included there.

In order to do it you should go to **[cdn](../cdn)** package:
```
cd ../cdn
```

And run:
```
yarn start
```

**In a different terminal** you should go to workspace package:
```
cd packages/workspace
```
And run:
```
yarn start
```

You will be able to open an example on [localhost:1234](http://localhost:1234/).

This example is also being used for running Cypress tests on it.

