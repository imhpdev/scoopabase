import { map } from 'rxjs/operators';

/**
 * RxJs operator to limit ScoopaBase collection documents.
 * @param limit Number of document to limit
 * @returns Observable with limited documents mentioned in an argument.
 */
export const limit = <T>(limit: number) => map((x: T[]) => x.slice(0, limit));
