// import { Observable } from 'rxjs';
// import { ScoopaDocument } from '../scoopabase.interface';

// /**
//  * @deprecated
//  * @returns collection without key
//  */
// export const mapWithoutKeys = <T, U>() => {
//   return (source: Observable<ScoopaDocument<T>[]>) =>
//     new Observable<ScoopaDocument<U>[]>(subscriber => {
//       return source.subscribe({
//         next: v => {
//           if (Array.isArray(v)) {
//             subscriber.next(_mapWithoutKey(v));
//           }
//         },
//         error: e => subscriber.error(e),
//         complete: () => subscriber.complete(),
//       });
//     });
// };

// function _mapWithoutKey<T, U>(arr: ScoopaDocument<T>[]): ScoopaDocument<U>[] {
//   return arr;
//   // return arr.map((document: ScoopaDocument<T>) => document.value);
// }
