# Template extension

Widget detailed info

## Install

### NPM

To install the package from NPM registry you should run

    yarn add @capsulajs/capsulahub-widget-template

or

    npm install @capsulajs/capsulahub-widget-template

### CDN

You can get the default export from the link

    https://capsulajs.s3.amazonaws.com/develop/widget-template/index.js

## WorkspaceConfiguration example

```json
{
  "components": {
    "layouts": {},
    "items": {
      "test-widget-id": {
        "componentName": "web-test-widget",
        "path": "https://capsulajs.s3.amazonaws.com/develop/widget-template/index.js",
        "config": { "title": "Base Test Widget" }
      }
    }
  }
}
```

## Exports

### Default

Bootstrap function of the extension.

### Named (API)

The public API of the extension.

## API

### CDN

[The documentation about public API.](https://capsulajs.s3.amazonaws.com/develop/widget-template/doc/index.html)

### Local

Run 

    yarn doc

And open [doc/index.html](./doc/index.html) in browser.

## Example

Internally example prepares the widget almost in the same way as **Workspace** does it.

### Run
`yarn start`

It will use the local version of extension from local **_src_**.

The bundle is being loaded statically in order to provide **_watch mode_**.

## Tests

### Run

1) `yarn test`
2) `yarn test:debug`

### Add new commands (in Cypress)

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

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.

## [Back to the Main Page](../../README.md)
