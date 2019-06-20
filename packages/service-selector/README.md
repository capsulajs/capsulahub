## Selector service

Selector service for the Capsulahub.

The purpose of this service is to provide a utility tool that allows user to select a specific data 
inside a collection of data.

## Install

### NPM

To install the package from NPM registry you should run

```
yarn add @capsulajs/capsulahub-service-selector
```

or
```
npm install @capsulajs/capsulahub-service-selector
```

### CDN

You can get the default export from the link

```
https://capsulajs.s3.amazonaws.com/develop/service-selector/index.js
```

## Exports

### Default

Bootstrap function of the extension.

### Named (API)

The public API of the extension.

## API

| method          | description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `setItems`      | set array of Items in the Selector instance                      |
| `items$`        | get Observable of Items array currently in the Selector instance |
| `selectItem`    | define an Item from items$ as selected Item                      |
| `selectedItem$` | get Observable of currently selected Item                        |

## Example

This service takes two typed elements (`Item` and `Key`).

```typescript
import { Selector } from '@capsulajs/capsulahub-service-selector';

interface Item {
  name: string;
  age: number;
  role: string;
}

interface Key {
  name: string;
}

const data = [
  { name: 'Pim', age: 22, role: 'first' },
  { name: 'Pam', age: 42, role: 'second' },
  { name: 'Pom', age: 32, role: 'third' },
];
// Init selector with typed elements
const selector = new Selector<Item, Key>();
// Fill the selector with data
selector.setItems({ items: data })
  .then(() => console.log(`setItems completed`));
// Subscribe to selector's data
selector.items$({}).subscribe(console.log);
// Output 
// [ { name: 'Pim', age: 22, role: 'first' },
//   { name: 'Pam', age: 42, role: 'second' },
//   { name: 'Pom', age: 32, role: 'third' } ]

// Select an Item
selector.selectItem({ key: { name: 'Pim' }})
  .then(() => console.log(`Item selected`));
// Subscribe to selector selected item
selector.selectedItem$({}).subscribe(console.log);
// Output
// { name: 'Pim', age: 22, role: 'first' }
```

## Test

`npm run test` or `yarn test`

## Licence

[CapsulaHub](https://github.com/capsulajs/capsulahub) and related services are released under MIT Licence.
