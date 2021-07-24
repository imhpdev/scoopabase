import * as Localforage from 'localforage';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ScoopaDocument } from './scoopabase.interface';
import { generateUUID, isNotEmpty } from './utils';

export class Collection {
  private _store!: LocalForage;
  private _storeSubject = new BehaviorSubject<Array<ScoopaDocument>>([]);
  private _store$ = this._storeSubject.asObservable().pipe(filter(isNotEmpty));

  constructor(instance: LocalForage) {
    this._store = instance;
    this._iterateStore();
    return this;
  }

  private _updated() {
    this._iterateStore();
  }

  set(value: any, key: string = generateUUID()): Promise<any> {
    return this._store
      .setItem(key, value)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  updateDocument(key: string, newDocument: any): Promise<any> {
    return this._store
      .setItem(key, newDocument)
      .then((value: any) => {
        this._updated();
        return new Promise((res, _) => res(value));
      })
      .catch((err: any) => new Promise((_, rej) => rej(err)));
  }

  getCollection$(): Observable<ScoopaDocument[]> {
    const collection$ = this._store$.pipe(
      map((objects: ScoopaDocument[]) => this._mapWithoutKey(objects))
    );
    return collection$;
  }

  getCollectionWithKey$(): Observable<ScoopaDocument[]> {
    const collection$ = this._store$.pipe();
    return collection$;
  }

  getDocument$(key: string): Observable<any> {
    const document$ = this._store$.pipe(
      map((objects: ScoopaDocument[]) => objects.find(obj => obj.key === key))
    );
    return document$;
  }

  getDocument(key: string) {
    return Localforage.getItem(key);
  }

  private _iterateStore() {
    const storeData: Array<ScoopaDocument> = [];
    this._store
      .iterate((value: any, key: string) => {
        storeData.push({ value: value, key: key });
      })
      .then(() => {
        this._storeSubject.next(storeData);
      })
      .catch(() => {
        console.log('Error While Iterating through Collection...');
      });
  }

  private _mapWithoutKey(arr: ScoopaDocument[]) {
    return arr.map(
      (document: ScoopaDocument) =>
        ({ value: document.value } as ScoopaDocument)
    );
  }
}
