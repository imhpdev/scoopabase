# ScoopaBase

A Firestore-Style Databse... Offline! Live Updates on Document change.

ScoopaBase gives you an offline database with simplicity & power of Firestore, And It stores data in user's browser - IndexDB.

ScoopaBase is build on top of [LocalForage](https://github.com/localForage/localForage).
## Contents

- [Getting Started](#getting-started)
  - [Installation & Initialisation](#installation--initialisation)
    - [With a Script Tag](#with-a-script-tag)
    - [With NPM](#with-npm)
    - [With NuxtJS](#with-nuxtjs)
- [Video Introduction](#video-introduction)
- [Quick Start](#quick-start)
- [Adding Data](#adding-data)
  - [Add a document to a collection](#add-a-document-to-a-collection)
  - [Update a document](#update-a-document)
  - [Set a document (overwrite)](#set-a-document-overwrite)
  - [Set a collection (overwrite)](#set-a-collection-overwrite)
- [Getting Data](#getting-data)
  - [Get a collection](#get-a-collection)
  - [Order a collection](#order-a-collection)
  - [Limit a collection](#limit-a-collection)
  - [Get a document](#get-a-document)
- [Deleting Data](#deleting-data)
  - [Delete a document](#delete-a-document)
  - [Delete a collection](#delete-a-collection)
  - [Delete a database](#delete-a-database)
- [Advanced Usage with Keys](#advanced-usage-with-keys)
  - [Add a document & specify your own key](#add-a-document--specify-your-own-key)
  - [Set a collection (overwrite) including keys](#set-a-collection-overwrite-including-keys)
  - [Get, Update, Set or Delete a Document by key (instead of by document criteria)](#get-update-set-or-delete-a-document-by-key-instead-of-by-document-criteria)
  - [Get a Collection and return the keys along with the data.](#get-a-collection-and-return-the-keys-along-with-the-data)
- [Promises](#promises)
  - [Add Document then do something](#add-document-then-do-something)
  - [Update Document then do something](#update-document-then-do-something)
  - [Set Document then do something](#set-document-then-do-something)
  - [Delete Document then do something](#delete-document-then-do-something)
  - [Delete Collection then do something](#delete-collection-then-do-something)
  - [Delete Database then do something](#delete-database-then-do-something)
- [Async / Await](#async--await)
  - [Add Documents (with Async Await)](#add-documents-with-async-await)
  - [Update Document (with Async Await)](#update-document-with-async-await)
  - [Set Document (with Async Await)](#set-document-with-async-await)
  - [Get Collection & Catch Errors (with Async Await)](#get-collection--catch-errors-with-async-await)
- [Configuration](#configuration)
  - [Disable the Gorgeous Logs](#disable-the-gorgeous-logs)
- [Localbase Playground](#localbase-playground)

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

#### Setup Files

This is the folder structure we set up for you:

```txt
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
