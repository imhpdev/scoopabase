import { map } from 'rxjs/operators';
import { getKeyValue, isKeyExist } from '../utils';

/**
 * RxJs operator to order data based on key for ScoopaBase documents in collection.
 * @param key Key on which OrderBy is going to perform
 * @param orderBy Type `ASC` - ascending order OR `DESC` - descending order
 * @returns RxJs Obseravble with ordered data
 */
export const orderby = <T>(key: string, orderBy = 'asc') =>
  map((res: T[]) => {
    const temp = res.filter(obj =>
      obj ? isKeyExist(obj, key) : isKeyExist(obj, key)
    );
    const newArr: T[] = temp.sort((objA: T, objB: T) => {
      const valueA = getKeyValue(objA, key);
      const valueB = getKeyValue(objB, key);

      return valueA.toString() - valueB.toString();
    });
    if (orderBy === 'desc') {
      return newArr.reverse();
    }
    return newArr;
  });
