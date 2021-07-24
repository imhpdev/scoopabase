export const isNotUndefined = <T>(data: T | undefined): data is T =>
  data !== undefined;
export const isNotNull = <T>(data: T | null): data is T => data !== null;
export const isTrue = <T>(data: T | false): data is T => data !== false;
export const isNotEmpty = <T>(data: T[]): data is T[] => data.length > 0;
