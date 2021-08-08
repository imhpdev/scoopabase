import { Observable } from 'rxjs';
import { Document } from '../scoopabase.interface';

/**
 * RxJs operator to start a result from specific point in ScoopaBase collection documents.
 * @param limit Number of document to limit
 * @returns Observable with limited documents mentioned in an argument.
 */
export const startBefore = <T>(lastDocumentKey: string) => {
  return (source: Observable<Document<T>[]>) =>
    new Observable<Document<T>[]>(subscriber => {
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

function _filterCollection<T>(
  array: Array<Document<T>>,
  lastDocumentKey: string
): Array<Document<T>> {
  const startIndex =
    array
      .map(obj => obj.key)
      .reverse()
      .indexOf(lastDocumentKey) + 1;
  return array.reverse().splice(startIndex);
}
