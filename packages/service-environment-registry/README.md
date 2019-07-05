# Environment Registry service extension

This service allows to register and load different versions of a project/service environment.  
This is the bootstrapped service ready to use for CapsulaHub.  
More detailed info are available [here](https://github.com/capsulajs/environment-registry).

## Install

### NPM

To install the package from NPM registry you should run

    yarn add @capsulajs/capsulahub-service-environment-registry

or

    npm install @capsulajs/capsulahub-service-environment-registry

### CDN

You can get the default export from the link

    https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-environment-registry/index.js

## WorkspaceConfiguration example

```json
{
  "services": [
    {
      "serviceName": "EnvironmentRegistryService",
      "path": "https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-environment-registry/index.js",
      "definition": {
        "serviceName": "EnvironmentRegistryService",
        "methods": {
          "register": { "asyncModel": "requestResponse" },
          "environments$": { "asyncModel": "requestStream" }
        }
      },
      "config": { 
        "serviceName": "EnvironmentRegistryService",
        "token": "workspace"
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

## Usage

See [here](https://github.com/capsulajs/environment-registry#basic-usage)

## API

### CDN

[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/service-environment-registry/doc/index.html)

### Local

Run 

    yarn doc

And open [doc/index.html](./doc/index.html) in browser.

## Tests

### Run

1) `yarn test`
2) `yarn test:debug`

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.

## [Back to the Main Page](../../README.md)
