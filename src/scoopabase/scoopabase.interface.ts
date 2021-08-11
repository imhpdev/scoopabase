export interface InstanceMetaData {
  name: string;
  storeName: string;
}

export interface CollectionDictionary {
  [key: string]: any;
}

export interface PromiseResponse<T> {
  isSuccessful: boolean;
  res: string | (T & { key: string }) | (T & { key: string })[];
}
