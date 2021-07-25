import * as LocalForage from 'localforage';
import { Collection } from './collection.class';
import { CollectionDictionary, InstanceMetaData } from './scoopabase.interface';

export class ScoopaBase {
  private _db = '';
  private _collectionDict: CollectionDictionary = {};

  /**
   * @param name DB name.
   */
  constructor(name: string) {
    this._db = name;
  }

  /**
   * Create new/Get existing collection from a database.
   * @param name Name of a collection to create/access in a DB
   * @returns retuens Instance of Collection Class, on which all CRUD operations happen
   */
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

  /**
   * Delete collection from a database
   * @param instanceName collection name in a database
   */
  deleteCollection(instanceName: string): any {
    const instance = LocalForage.createInstance(
      this._getInstanceMetaData(instanceName)
    );
    instance
      .dropInstance()
      .then(() => {
        if (this._collectionDict[instanceName]) {
          delete this._collectionDict[instanceName];
        }
        return new Promise((res, _) => res(true));
      })
      .catch(() => new Promise((_, rej) => rej(false)));
  }

  /**
   * Delete all collections in database
   * @returns Boolean to check if database is deleted or not
   */
  deleteDatabase(): boolean {
    Object.keys(this._collectionDict).forEach(key => {
      this.deleteCollection(key).then(() => (this._collectionDict[key] = null));
    });
    return Object.keys(this._collectionDict).every(
      key => this._collectionDict[key] === null
    );
  }

  /**
   *
   * @param name Collection Name
   * @returns Meta data to dreate a Localforage instance for this DB.
   */
  private _getInstanceMetaData(name: string) {
    return {
      driver: LocalForage.INDEXEDDB,
      name: this._db,
      storeName: name,
    } as InstanceMetaData;
  }
}
