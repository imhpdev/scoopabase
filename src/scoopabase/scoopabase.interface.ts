export interface InstanceMetaData {
  name: string;
  storeName: string;
}

export interface CollectionDictionary {
  [key: string]: any;
}

export type Document<T> = {
  [P in keyof T]: T[P];
} & { key: string };

export interface PromiseResponse<T> {
  isSuccessful: boolean;
  res: string | Document<T> | Array<Document<T>>;
}
