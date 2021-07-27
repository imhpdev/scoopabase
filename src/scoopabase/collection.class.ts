import { BehaviorSubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ScoopaDocument, PromiseResponse } from './scoopabase.interface';
import { generateUUID, isNotEmpty } from './utils';

export class Collection {
  /**
   * Backbone of a collection.
   */
  private _store!: any;
  private _storeDocuments!: ScoopaDocument[];

  /**
   * Subject to store data of collection. which is updated and emit whole collection documents everytime when CRUD operation happpens.
   */
  private _storeSubject = new BehaviorSubject<Array<ScoopaDocument>>([]);
  private _store$ = this._storeSubject.asObservable().pipe(filter(isNotEmpty));

  /**
   * Observable to get all Documents in a Collection with associate key
   * returns Array of All documents
   * ex: [{...},{...},{...}]
   */
  documents$ = this._store$.pipe();

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
  add(value: any, key: string = generateUUID()): Promise<PromiseResponse> {
    return this._store
      .setItem(key, value)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) =>
          res({ isSuccessful: true, res: value } as PromiseResponse)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse)
          )
      );
  }

  /**
   * To store multiple documents in Collection at once.
   * @param documents Array of documents to store in a collection
   */
  addDocuments(documents: Array<any>) {
    documents.forEach(document => this.add(document));
  }

  /**
   * Update a document into Collection
   * @param newDocument Take Json Object to update into a Collection
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  update(newDocument: any, key: string): Promise<PromiseResponse> {
    return this._store
      .setItem(key, newDocument)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) =>
          res({ isSuccessful: true, res: value } as PromiseResponse)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse)
          )
      );
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
   *
   * @returns A promise with all documents in a collection or error promise
   */
  getAll(): Promise<PromiseResponse> {
    return this._storeDocuments
      ? new Promise((res, _) =>
          res({
            isSuccessful: false,
            res: this._storeDocuments,
          } as PromiseResponse)
        )
      : new Promise((_, rej) =>
          rej({
            isSuccessful: false,
            res: 'No documents found in collection.',
          } as PromiseResponse)
        );
  }

  /**
   * Delete a specific document
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  delete(key: string): Promise<PromiseResponse> {
    return this._store
      .removeItem(key)
      .then(() => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: 'Selected documents has been removed from a collection',
          } as PromiseResponse)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse)
          )
      );
  }

  /**
   * Delete all documents in a Collection
   * @returns Prmoise
   */
  clearAll(): Promise<PromiseResponse> {
    return this._store
      .clear()
      .then(() => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: 'All documents has been cleared from a collection',
          } as PromiseResponse)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse)
          )
      );
  }

  /**
   * Iterates a Collection everytime when CRUD operation happens in a Collection
   */
  private _iterateStore(): void {
    const storeData: Array<ScoopaDocument> = [];
    this._store
      .iterate((value: any, key: string) => {
        const data = value;
        storeData.push({ ...data, key: key });
      })
      .then(() => {
        this._storeDocuments = storeData;
        this._storeSubject.next(this._storeDocuments);
      })
      .catch(() => {
        console.log('Error While Iterating through Collection...');
      });
  }
}
