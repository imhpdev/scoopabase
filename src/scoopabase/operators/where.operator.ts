import { map } from 'rxjs/operators';
import { getKeyValue } from '../utils';

type WhrOpertor = '<' | '<=' | '==' | '>=' | '>' | 'includes' | 'contains';

/**
 * RxJs operator to query data in ScoopaBase Collection documents.
 * @param key On which the comparision operation will performed
 * @param operator what kind of comparison is going to performed.
 * @param compareTo With what value, the key value is going to compared
 * @returns RxJs observable with filtered result.
 */
export const where = <T>(key: string, operator: WhrOpertor, compareTo: any) =>
  map((res: T[]) => {
    return res.filter(obj => {
      const value = getKeyValue(obj, key);
      if (value) {
        switch (operator) {
          case '<':
            return value < compareTo;
          case '<=':
            return value <= compareTo;
          case '==':
            return value === compareTo;
          case '>=':
            return value >= compareTo;
          case '>':
            return value > compareTo;
          case 'includes':
            if (typeof value === 'string') {
              return value
                .toLocaleLowerCase()
                .includes(compareTo.toLocaleLowerCase());
            }
            return false;
          case 'contains':
            if (Array.isArray(value)) {
              return value.includes(compareTo);
            } else {
              return false;
            }
        }
      }
      return false;
    });
  });
