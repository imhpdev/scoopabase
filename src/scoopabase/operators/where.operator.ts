import { Observable } from 'rxjs';
import { ScoopaDocument } from '../scoopabase.interface';
import { getKeyValue } from '../utils';

type WhrOpertor = '<' | '<=' | '==' | '>=' | '>' | 'includes' | 'contains';

/**
 * RxJs operator to query data in ScoopaBase Collection documents.
 * @param key On which the comparision operation will performed
 * @param operator what kind of comparison is going to performed.
 * @param compareTo With what value, the key value is going to compared
 * @returns RxJs observable with filtered result.
 */
export const where = <T>(key: string, operator: WhrOpertor, compareTo: any) => {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
      return source.subscribe({
        next: v => {
          if (Array.isArray(v)) {
            subscriber.next(_filterArray(v, key, operator, compareTo));
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
  operator: WhrOpertor,
  compareTo: any
): ScoopaDocument[] {
  return array.filter(obj => {
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
            return value.toLocaleLowerCase().includes(compareTo);
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
}
