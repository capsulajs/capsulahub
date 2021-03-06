# Service Template extension

Service detailed info

## Install

### NPM

To install the package from NPM registry you should run

    yarn add @capsulajs/capsulahub-service-template

or

    npm install @capsulajs/capsulahub-service-template


### CDN

You can get the default export from the link

    https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-template/index.js

## WorkspaceConfiguration example

```json
{
  "services": [
    {
      "serviceName": "TestService",
      "path": "https://capsulajs.s3.amazonaws.com/develop/capsulahub-service-template/index.js",
      "definition": {
        "serviceName": "TestService",
        "methods": {
          "showMessage": { "asyncModel": "requestResponse" }
        }
      },
      "config": { 
         "serviceName":"message",
         "message": "Test message"
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

[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/service-template/doc/index.html)

### Local

Run 

    yarn doc

And open [doc/index.html](./doc/index.html) in browser.


## Example

All of the manual debugging should be provided only in _**test:debug**_ mode. Example folder is required only for Cypress needs.

## Tests

### Run

1) `yarn test`
2) `yarn test:debug`

### Recommendations for testing

**_getServiceRef()_** checks that the service has been bootstrapped correctly and returns the instance of the service.

In order to create a **_stub_** or **_spy_** of any util a file with utils has to export an object, in which these utils
are implemented. Then in the implementation of a test you can do:

```typescript
import utils from '../../src/utils';
const getConfigStub = cy.stub(utils, getConfig);
getConfigStub.resolves({ name: 'configuration name' });

// run some code from functionality
expect(getConfigStub).to.be.called;
```

Expectations for stubs and spies:

<https://docs.cypress.io/guides/references/assertions.html#Sinon-Chai>

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.

## [Back to the Main Page](../../README.md)
