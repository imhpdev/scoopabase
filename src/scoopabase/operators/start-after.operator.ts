import { Observable } from 'rxjs';
import { ScoopaDocument } from '../scoopabase.interface';

/**
 * RxJs operator to start a result from specific point in ScoopaBase collection documents.
 * @param limit Number of document to limit
 * @returns Observable with limited documents mentioned in an argument.
 */
export const startAfter = <T>(lastDocumentKey: string) => {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
      return source.subscribe({
        next: v => {
          if (Array.isArray(v)) {
            subscriber.next(_filterCollection(v, lastDocumentKey));
          }
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete(),
      });
    });
};

function _filterCollection(
  array: Array<ScoopaDocument>,
  lastDocumentKey: string
) {
  const startIndex = array.map(obj => obj.key).indexOf(lastDocumentKey) + 1;
  return array.splice(startIndex);
}
