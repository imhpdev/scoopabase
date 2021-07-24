import * as LocalForage from 'localforage';
import { Collection } from './collection.class';
import { CollectionDictionary, InstanceMetaData } from './scoopabase.interface';

export class ScoopaBase {
  private _db = '';
  private _collectionDict: CollectionDictionary = {};

  constructor(name: string) {
    this._db = name;
  }

  collection(name: string): Collection {
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

  deleteCollection(instanceName: string) {
    const instance = LocalForage.createInstance(
      this._getInstanceMetaData(instanceName)
    );
    if (this._collectionDict[instanceName]) {
      delete this._collectionDict[instanceName];
    }
    instance.dropInstance();
  }

  private _getInstanceMetaData(name: string) {
    return {
      driver: LocalForage.INDEXEDDB,
      name: this._db,
      storeName: name,
    } as InstanceMetaData;
  }
}
