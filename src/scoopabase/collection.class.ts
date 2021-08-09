import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document, PromiseResponse } from './scoopabase.interface';
import { generateUUID } from './utils';

export class Collection<T> {
  /**
   * Backbone of a collection.
   */
  private _store!: any;
  private _storeDocuments!: Document<T>[];

  /**
   * Subject to store data of collection. which is updated and emit whole collection documents everytime when CRUD operation happpens.
   */
  private _storeSubject = new BehaviorSubject<Array<Document<T>>>([]);
  private _store$ = this._storeSubject.asObservable().pipe();

  /**
   * Observable to get all Documents in a Collection with associate key
   * returns Array of All documents
   * ex: [{...},{...},{...}]
   */
  documents$: Observable<Document<T>[]> = this._store$.pipe();

  /**
   * Observable of a ocument
   * @param key type string to find a document in a collection
   * @returns Observable of a Documents.
   */
  document$ = (key: string) =>
    this._store$.pipe(
      map((objects: Document<T>[]) => objects.find(obj => obj.key === key))
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
  add<T>(value: T, key: string = generateUUID()): Promise<PromiseResponse<T>> {
    return this._store
      .setItem(key, value)
      .then((value: Document<T>) => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: { ...value, key: key },
          } as PromiseResponse<T>)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse<T>)
          )
      );
  }

  /**
   * To store multiple documents in Collection at once.
   * @param documents Array of documents to store in a collection
   */
  addDocuments(documents: Array<T>) {
    documents.forEach(document => this.add(document));
  }

  /**
   * Update a document into Collection
   * @param newDocument Take Json Object to update into a Collection
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  update<T>(newDocument: T, key: string): Promise<PromiseResponse<T>> {
    return this._store
      .setItem(key, newDocument)
      .then((value: Document<T>) => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: { ...value, key: key },
          } as PromiseResponse<T>)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse<T>)
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
  getAll(): Promise<any> {
    return this._storeDocuments
      ? new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: this._storeDocuments,
          })
        )
      : new Promise((_, rej) =>
          rej({
            isSuccessful: false,
            res: 'No documents found in collection.',
          })
        );
  }

  /**
   * Delete a specific document
   * @param key To find JSON Object in Collection
   * @returns Promise
   */
  delete<T>(key: string): Promise<PromiseResponse<T>> {
    return this._store
      .removeItem(key)
      .then(() => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: 'Selected documents has been removed from a collection',
          } as PromiseResponse<T>)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse<T>)
          )
      );
  }

  /**
   * Delete all documents in a Collection
   * @returns Prmoise
   */
  clearAll(): Promise<PromiseResponse<T>> {
    return this._store
      .clear()
      .then(() => {
        this._updated();
        return new Promise((res, _) =>
          res({
            isSuccessful: true,
            res: 'All documents has been cleared from a collection',
          } as PromiseResponse<T>)
        );
      })
      .catch(
        (err: any) =>
          new Promise((_, rej) =>
            rej({ isSuccessful: false, res: err } as PromiseResponse<T>)
          )
      );
  }

  /**
   * Iterates a Collection everytime when CRUD operation happens in a Collection
   */
  private _iterateStore(): void {
    const storeData: Document<T>[] = [];
    this._store
      .iterate((value: T, key: string) => {
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
