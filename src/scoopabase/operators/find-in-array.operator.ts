// import { Observable } from 'rxjs';
// import { ScoopaDocument } from '../collection.interface';
// import { getKeyValue } from '../utils/get-key-value.util';

// export const findInArray = <T, R>(key: string, fn: (value: T) => R) => {
//   return (source: Observable<T>) =>
//     new Observable<R>((subscriber) => {
//       return source.subscribe({
//         next: (v) => {
//           try {
//             if (Array.isArray(v)) {
//               subscriber.next(_filterArray(v, key, fn));
//             }
//           } catch (err) {
//             subscriber.error(err);
//             return;
//           }
//         },
//         error: (e) => subscriber.error(e),
//         complete: () => subscriber.complete(),
//       });
//     });
// };

// function _filterArray(array: Array<ScoopaDocument>, key: string, callback: any): any {
//   const newArr = array.filter((obj) => {
//     const value = getKeyValue(obj.value, key);
//     try {
//       if (Array.isArray(value)) {
//         return callback(value);
//       }
//       return false;
//     } catch (err) {
//       console.log('Error while performing user defined function on Array type.');
//     }
//   });
//   return newArr;
// }
