import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { mapWithoutKeys } from './operators/map-without-keys.operator';
import { ScoopaDocument } from './scoopabase.interface';
import { generateUUID, isNotEmpty } from './utils';

export class Collection {
  /**
   * Backbone of a collection.
   */
  private _store!: any;

  /**
   * Subject to store data of collection. which is updated and emit whole collection documents everytime when CRUD operation happpens.
   */
  private _storeSubject = new BehaviorSubject<Array<ScoopaDocument>>([]);
  private _store$ = this._storeSubject.asObservable().pipe(filter(isNotEmpty));

  /**
   * Observable to get all Documents in a Collection
   * returns Array of All documents
   * ex: [{...},{...},{...}]
   */
  documents$ = this._store$.pipe(mapWithoutKeys());

  /**
   * Observable to get all Documents in a Collection with associate Key
   * returns Array of All documents with it's associate Key
   * ex: [{ key: 'test', data: {...} }]
   */
  documentsWithKey$ = this._store$;

  /**
   * Observable of a ocument
   * @param key type string to find a document in a collection
   * @returns Observable of a Documents.
   */
  document$ = (key: string) =>
    this._store$.pipe(
      map((objects: ScoopaDocument[]) => objects.find(obj => obj.key === key))
    );

  /**
   * @param instance Take instance of a LocalForage from a ScoopaBase class
   */
  constructor(instance: any) {
    this._store = instance;
    this._iterateStore();
  }

  /**
   * To update a store on every operation (add, update, delete) performed on a Collection
   */
  private _updated() {
    this._iterateStore();
  }

  /**
   * Add a document into Collection
   * @param value Take Json Object to store into a Collection
   * @param key An optional argument for a unique identification to point JSON Object in Collection
   * @returns Prmosie
   */
  add(value: any, key: string = generateUUID()): Promise<any> {
    return this._store
      .setItem(key, value)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  /**
   * Update a document into Collection
   * @param newDocument Take Json Object to update into a Collection
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  update(newDocument: any, key: string): Promise<any> {
    return this._store
      .setItem(key, newDocument)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  /**
   * Get a specific document
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  get(key: string): Promise<any> {
    return this._store.getItem(key);
  }

  /**
   * Delete a specific document
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  delete(key: string): Promise<any> {
    return this._store
      .removeItem(key)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  /**
   * Delete all documents in a Collection
   * @returns Prmoise
   */
  clearAll(): Promise<any> {
    return this._store
      .clear()
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  /**
   * Iterates a Collection everytime when CRUD operation happens in a Collection
   */
  private _iterateStore(): void {
    const storeData: Array<ScoopaDocument> = [];
    this._store
      .iterate((value: any, key: string) => {
        storeData.push({ data: value, key: key });
      })
      .then(() => {
        this._storeSubject.next(storeData);
      })
      .catch(() => {
        console.log('Error While Iterating through Collection...');
      });
  }
}
