import * as LocalForage from 'localforage';
import { Collection } from './collection.class';
import { CollectionDictionary, InstanceMetaData } from './scoopabase.interface';

export class ScoopaBase {
  private _db = '';
  private _collectionDict: CollectionDictionary = {};

  constructor(name: string) {
    LocalForage.setDriver(LocalForage.INDEXEDDB);
    this._db = name;
  }

  collection(name: string) {
    if (this._collectionDict[name]) {
      return this._collectionDict[name];
    } else {
      const instance = LocalForage.createInstance(
        this._getInstanceMetaData(name)
      );
      const collectionInstance = new Collection(instance);
      this._collectionDict[name] = collectionInstance;
      return collectionInstance;
    }
  }

  private _getInstanceMetaData(name: string) {
    return {
      name: this._db,
      storeName: name,
    } as InstanceMetaData;
  }
}
