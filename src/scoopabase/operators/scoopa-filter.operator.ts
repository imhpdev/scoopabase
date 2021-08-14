import { map } from 'rxjs/operators';
import { getKeyValue } from '../utils';

/**
 *
 * @param key : A key on which comparision will happen
 * @param callback : A filter function provided by user which will filter out things
 * @returns : a filtered result after applying filter callback function
 */

export const scoopaFilter = <T>(key: string, filterFunction: any) =>
  map((res: T[]) => {
    return res.filter(obj => {
      const value = getKeyValue(obj, key);
      return filterFunction(value);
    });
  });
