# Fantohm Product Ecosystem

Fantohm product ecosystem monorepo.

## Installation

`yarn`

## Development server

Run `nx serve usdb` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.
Current applications:

- usdb: https://www.usdbalance.com/ primary usdb application, trad-fi, single sided staking, etc.
- balance: USDB landing page. Balance ecosystem information.
- nft-market: https://www.liqdnft.com/ nft lending.

## Code scaffolding

New Component: Run `nx g c my-component --project=usdb --directory=app/components` to generate a new component.
New Page: Run `nx g c my-component --project=usdb --directory=app/pages` to generate a new page.

## Generate a library

Run `nx g @nrwl/react:library shared/ui-charts` to generate a library...

> You can also use any of the plugins above to generate libraries as well..

Libraries are shareable across libraries and applications. They can be imported from `@fantohm/mylib`.

## Build

Run `nx build usdb` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test usdb` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e usdb` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

## Adding capabilities to your workspace

This project was generated using [Nx](https://nx.dev).

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are our core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- Web (no framework frontends)
  - `npm install --save-dev @nrwl/web`
- [Angular](https://angular.io)
  - `npm install --save-dev @nrwl/angular`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`
- [Express](https://expressjs.com)
  - `npm install --save-dev @nrwl/express`
- [Node](https://nodejs.org)
  - `npm install --save-dev @nrwl/node`

There are also many [community plugins](https://nx.dev/community) you could add.

## Generate an application

Run `nx g @nrwl/react:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Further NX help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Code and File standards

When in doubt: https://google.github.io/styleguide/tsguide.html

### Identifiers

| Style          | Category                                                           |
| -------------- | ------------------------------------------------------------------ |
| UpperCamelCase | class / interface / type / enum / decorator / type parameters      |
| lowerCamelCase | variable / parameter / function / method / property / module alias |
| CONSTANT_CASE  | global constant values, including enum values                      |
| #ident         | private identifiers are never used.                                |

### Imports

Module namespace imports are lowerCamelCase while files are kabab-case, which means that imports correctly will not match in casing style, such as:
`src/app/pages/my-page-name/my-page-name.tsx`
`src/app/components/new-component-plus/new-component-plus.tsx`

Code should pass all eslint tests and any prettification rules unless exception is necessary and commented. .
