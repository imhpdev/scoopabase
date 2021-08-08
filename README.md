# ScoopaBase

A Firestore-Style Databse... Offline! Live Updates on Document change.

ScoopaBase gives you an offline database with simplicity & power of Firestore, And It stores data in user's browser - IndexDB.

ScoopaBase is build on top of 
[LocalForage](https://github.com/localForage/localForage).
[RxJs](https://github.com/reactivex/rxjs).
[Typescript](https://www.typescriptlang.org/).

## Contents

- [ScoopaBase](#scoopabase)
  - [Contents](#contents)
  - [Getting Started](#getting-started)
    - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Adding Data](#adding-data)
    - [Add a document to a Collection](#add-a-document-to-a-collection)
    - [Overwrite a document](#overwrite-a-document)
  - [Getting Data](#getting-data)
    - [Get a Collection Observable](#get-a-collection-observable)
    - [Get a Document Observable](#get-a-document-observable)
    - [Get a Document Promise](#get-a-document-promise)
  - [Advanced Usage with Operators](#advanced-usage-with-operators)
    - [OrderBy](#orderby)
    - [Limit](#limit)
    - [Where](#where)
    - [StartAfter](#startafter)
    - [StartBefore](#startbefore)
  - [Deleting Data, Collection and Database](#deleting-data-collection-and-database)
    - [Delete a document](#delete-a-document)
    - [Clear Collection](#clear-collection)
    - [Delete a collection](#delete-a-collection)
    - [Delete Database](#delete-database)
  

## Getting Started

### Installation

```
npm install scoopabase --save
```

```javascript
import { ScoopaBase } from 'scoopabase'

let db = new ScoopaBase('db')
```

## Quick Start

Getting started by adding a new document into a collection. Just call `collection` method on `db` object and pass a `collection-name` as an argument. then specify a document you want to add with th `add` method.

```javascript
db.collection('users').add({
  id: 1,
  name: 'imhpdev',
  age: 150
}, 'key')
```

Now your document has been added to the collection. Now let's retrive it. 

```javascript
db
  .collection('users')
  .get('key')
  .then((value) => {...});

// { id: 2, name: 'Paul', age: 34 }
```

## Adding Data

### Add a document to a Collection

Add a document without a key

```javascript
db.collection('users').add({
  id: 1,
  name: 'imhpdev',
  age: 150
})
```
Add a document with user-defined key

```javascript
db.collection('users').add({
  id: 1,
  name: 'imhpdev',
  age: 150
}, 'key')
```

Add multiple documents at once in a Collection.

```javascript
db.collection('users').addDocuments([
  {...},
  {...},
  {...},
  {...},
  {...},
  {...}
], 'key')
```

### Overwrite a document

```javascript
this.db.
  collection('users').
  update({ newKey: 'ohoooo!' },
   'key')
```

## Getting Data

### Get a Collection Observable

Get all documents Observable from a collection with it's associate `key`.

```javascript
db.collection('users').documents$.subscribe(data => {...})

//  [
//    { id: 1, name: 'Bill', age: 47 },
//    { id: 2, name: 'Paul', age: 34 }
//  ]
```

### Get a Document Observable

Get an individual document from a collection

```javascript
db
  .collection('users')
  .document$('key')
  .subscribe((value) => {...});

// { id: 2, name: 'Paul', age: 34 }
```

### Get a Document Promise

Get an individual document from a collection

```javascript
db
  .collection('users')
  .get('key')
  .then((value) => {...});

// { id: 2, name: 'Paul', age: 34 }
```
## Advanced Usage with Operators

ScoopaBase provides some operators to work with collection observable.

### OrderBy

`orderby` operator will allow to order a collection on any key value. 

```javascript
db
  .collection('user')
  .documents$
  .pipe(orderby('age'))
  .subscribe(() => {...})

//  [
//    { id: 2, name: 'Paul', age: 34 }
//    { id: 1, name: 'Bill', age: 47 },
//  ]
```

`orderby` will work on even nested key. If the nested key does not exist in a docment then it will filter-out those documents and it will be not included in a filtered list.

```javascript
db
  .collection('user')
  .documents$
  .pipe(orderby('name.fname'))
  .subscribe(() => {...})

//  [
//    { id: 2, name: { fname: 'Paul', lname: 'Costa'}, age: 34 }
//    { id: 1, name: { fname: 'Zendeya', lname: 'Bouch'}, age: 47 },
//  ]  
```

### Limit

`limit` operator will limit the number of documents comming from a Collection.

```javascript
db
  .collection('user')
  .documents$
  .pipe(limit(1))
  .subscribe(() => {...})

//  [
//    { id: 1, name: { fname: 'Zendeya', lname: 'Bouch'}, age: 47 },
//  ]  
```

### Where

`where` operater will filter-out documents in a collection based on a condition. This operator allows to query data on based on operator it supports. 
`where` queries data based on `<`, `<=`, `==`, `>=`, `>`, `includes`, `contains`.

`<`, `<=`, `==`, `>=`, `>` works on `string`, `number`, etc... types.

```javascript
db
  .collection('user')
  .documents$
  .pipe(where('name.age','>',40))
  .subscribe(() => {...})

//  [
//    { id: 1, name: { fname: 'Zendeya', lname: 'Bouch'}, age: 47 },
//  ]  
```

`contains` works on Array types.

```javascript
db
  .collection('user')
  .documents$
  .pipe(where('colors','contains',red))
  .subscribe(() => {...})

// Collection Data
//  [
//    { id: 1, colors: ['blue', 'green', 'red'], type: 'type A' },
//    { id: 2, colors: ['blue', 'green'], type: 'type B' },
//    { id: 3, colors: ['blue', ,'red'], type: 'type C' },
//  ] 

// Collection Data After Where Applied
//  [
//    { id: 1, colors: ['blue', 'green', 'red'], type: 'type A' },
//    { id: 3, colors: ['blue', ,'red'], type: 'type C' },
//  ] 
```

### StartAfter

`startAfter` operator will emit later documents from a document key specified in it's argument.
This operator combines with `limit` operator create pagination effect on a collection.

```javascript
db
  .collection('user')
  .documents$
  .pipe(
    startAfter('documentKey')
    limit(1)
  )
  .subscribe(() => {...})

//  [
//    { id: 1, name: { fname: 'Zendeya', lname: 'Bouch'}, age: 47 },
//  ]  
```


### StartBefore

`startBefore` operator will emit before documents from a document key specified in it's argument.
This operator combines with `limit` operator create pagination effect on a collection.

```javascript
db
  .collection('user')
  .documents$
  .pipe(
    startBefore('documentKey')
    limit(1)
  )
  .subscribe(() => {...})

//  [
//    { id: 1, name: { fname: 'Zendeya', lname: 'Bouch'}, age: 47 },
//  ]  
```

## Deleting Data, Collection and Database

### Delete a document
Delete a document from a collection.
```javascript
db.collection('users').deleteDocument('key').then(() => {...})
```

### Clear Collection
Delete all documents from a collection.
```javascript
db.collection('users').clearAll().then(() => {...})
```
### Delete a collection
Delete a collection and all documents contained in it.
```javascript
db.deleteCollection('collection-name')
```

### Delete Database
Delete whole database and it's all collection.
```javascript
db.deleteDatabase()
```
