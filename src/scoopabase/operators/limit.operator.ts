import { Observable } from 'rxjs';
import { Document } from '../scoopabase.interface';

/**
 * RxJs operator to limit ScoopaBase collection documents.
 * @param limit Number of document to limit
 * @returns Observable with limited documents mentioned in an argument.
 */
export const limit = <T>(limit: number) => {
  return (source: Observable<Document<T>[]>) =>
    new Observable<Document<T>[]>(subscriber => {
      return source.subscribe({
        next: v => {
          if (Array.isArray(v)) {
            subscriber.next(v.slice(0, limit));
          }
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete(),
      });
    });
};
