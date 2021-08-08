import { Observable } from 'rxjs';
import { Document } from '../scoopabase.interface';
import { getKeyValue, isKeyExist } from '../utils';

/**
 * RxJs operator to order data based on key for ScoopaBase documents in collection.
 * @param key Key on which OrderBy is going to perform
 * @param orderBy Type `ASC` - ascending order OR `DESC` - descending order
 * @returns RxJs Obseravble with ordered data
 */
export const orderby = <T>(key: string, orderBy = 'asc') => {
  return (source: Observable<Document<T>[]>) =>
    new Observable<Document<T>[]>(subscriber => {
      return source.subscribe({
        next: v => {
          if (Array.isArray(v)) {
            subscriber.next(_filterArray(v, key, orderBy));
          }
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete(),
      });
    });
};

function _filterArray<T>(
  array: Array<Document<T>>,
  key: string,
  orderBy: string
): Array<Document<T>> {
  const temp = array.filter(obj =>
    obj ? isKeyExist(obj, key) : isKeyExist(obj, key)
  );
  const newArr: Document<T>[] = temp.sort(
    (objA: Document<T>, objB: Document<T>) => {
      const valueA = getKeyValue(objA, key);
      const valueB = getKeyValue(objB, key);

      return valueA.toString() - valueB.toString();
    }
  );
  if (orderBy === 'desc') {
    return newArr.reverse();
  }
  return newArr;
}
