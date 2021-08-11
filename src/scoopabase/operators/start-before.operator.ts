import { map } from 'rxjs/operators';

/**
 * RxJs operator to start a result from specific point in ScoopaBase collection documents.
 * @param limit Number of document to limit
 * @returns Observable with limited documents mentioned in an argument.
 */
export const startBefore = <T>(lastDocumentKey: string) =>
  map((res: Array<T & { key: string }>) => {
    return res.reverse().splice(
      res
        .map(obj => obj.key)
        .reverse()
        .indexOf(lastDocumentKey) + 1
    );
  });
