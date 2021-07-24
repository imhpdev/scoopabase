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
  const temp = array.filter(obj => isKeyExist(obj.value, key));
  const newArr: ScoopaDocument[] = temp.sort(
    (objA: ScoopaDocument, objB: ScoopaDocument) => {
      const valueA = getKeyValue(objA.value, key);
      const valueB = getKeyValue(objB.value, key);

      return valueA.toString() - valueB.toString();
    }
  );
  if (orderBy === 'desc') {
    return newArr.reverse();
  }
  return newArr;
}
