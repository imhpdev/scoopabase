import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { mapWithoutKeys } from './operators/map-without-keys.operator';
import { ScoopaDocument } from './scoopabase.interface';
import { generateUUID, isNotEmpty } from './utils';

export class Collection {
  private _store!: any;
  private _storeSubject = new BehaviorSubject<Array<ScoopaDocument>>([]);
  private _store$ = this._storeSubject.asObservable().pipe(filter(isNotEmpty));

  constructor(instance: any) {
    this._store = instance;
    this._iterateStore();
  }

  private _updated() {
    this._iterateStore();
  }

  add(value: any, key: string = generateUUID()): Promise<any> {
    return this._store
      .setItem(key, value)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  update(newDocument: any, key: string): Promise<any> {
    return this._store
      .setItem(key, newDocument)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  getCollection$(): Observable<ScoopaDocument[]> {
    const collection$ = this._store$.pipe(mapWithoutKeys());
    return collection$;
  }

  getCollectionWithKey$(): Observable<ScoopaDocument[]> {
    const collection$ = this._store$.pipe();
    return collection$;
  }

  // getCollection(): Promise<any> {
  //   return this.getCollection$().toPromise();
  // }

  // getCollectionWithKeys(): Promise<any> {
  //   return this.getCollectionWithKey$().toPromise();
  // }

  get$(key: string): Observable<any> {
    const document$ = this._store$.pipe(
      map((objects: ScoopaDocument[]) => objects.find(obj => obj.key === key))
    );
    return document$;
  }

  get(key: string): Promise<any> {
    return this._store.getItem(key);
  }

  deleteDocument(key: string): Promise<any> {
    return this._store.removeItem(key);
  }

  clearCollection(): Promise<any> {
    return this._store.clear();
  }

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
