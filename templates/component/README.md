# Template extension

Component detailed info

# Exports

### Default

Bootstrap function of the extension.

### Named (API)

The public API of the extension.

# Example

Internally example prepares the component almost in the same way as **Workspace** does it.

### Run
`yarn start`

It will use the local version of extension from local **_src_**.

The bundle is being loaded statically in order to provide **_watch mode_**.

# Tests

### Run

1) `yarn test`
2) `yarn test:debug`

## Add new commands

New commands have to be typed correctly in typescript.

For example:

```typescript
Cypress.Commands.add('getHeading', () => {
  return cy.get('h1');
});

declare namespace Cypress {
  interface Chainable {
    getHeading: () => Chainable;
  }
}
```
