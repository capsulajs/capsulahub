# Service Template extension

![WebComponent](https://avatars0.githubusercontent.com/u/12896170?s=400&v=4)

Service detailed info

# Exports

### Default

Bootstrap function of the extension.

### Named (API)

The public API of the extension.

# Example

All of the manual debugging should be provided only in _**test:debug**_ mode. Example folder is required only for Cypress needs.

# Tests

### Run

1) `yarn test`
2) `yarn test:debug`

## Recommendations for testing

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
