import { Observable } from 'rxjs';
import { ScoopaDocument } from '../scoopabase.interface';
import { getKeyValue } from '../utils';

type WhrOpertor = '<' | '<=' | '==' | '>=' | '>' | 'includes';

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
    const value = getKeyValue(obj.value, key);
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
