import { Observable } from 'rxjs';
import { ScoopaDocument } from '../scoopabase.interface';
import { getKeyValue, isKeyExist } from '../utils';

export const orderby = <T>(key: string, orderBy = 'asc') => {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
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

function _filterArray(
  array: Array<ScoopaDocument>,
  key: string,
  orderBy: string
): Array<ScoopaDocument> {
  const temp = array.filter(obj =>
    obj.data ? isKeyExist(obj.data, key) : isKeyExist(obj, key)
  );
  const newArr: ScoopaDocument[] = temp.sort(
    (objA: ScoopaDocument, objB: ScoopaDocument) => {
      const valueA = objA.data
        ? getKeyValue(objA.data, key)
        : getKeyValue(objA, key);
      const valueB = objB.data
        ? getKeyValue(objB.data, key)
        : getKeyValue(objB, key);

      return valueA.toString() - valueB.toString();
    }
  );
  if (orderBy === 'desc') {
    return newArr.reverse();
  }
  return newArr;
}
