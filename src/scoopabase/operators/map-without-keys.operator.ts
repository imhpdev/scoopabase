import { Observable } from 'rxjs';
import { ScoopaDocument } from '../scoopabase.interface';

export const mapWithoutKeys = <T>() => {
  return (source: Observable<T>) =>
    new Observable<ScoopaDocument[]>(subscriber => {
      return source.subscribe({
        next: v => {
          if (Array.isArray(v)) {
            subscriber.next(_mapWithoutKey(v));
          }
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete(),
      });
    });
};

function _mapWithoutKey(arr: ScoopaDocument[]): ScoopaDocument[] {
  return arr.map((document: ScoopaDocument) => document.data);
}
