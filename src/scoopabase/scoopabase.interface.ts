export interface InstanceMetaData {
  name: string;
  storeName: string;
}

export interface CollectionDictionary {
  [key: string]: any;
}

export interface IScoopaDocument {
  key: string;
}

export interface ScoopaDocument extends IScoopaDocument {
  [key: string]: any;
}

export interface PromiseResponse {
  isSuccessful: boolean;
  res: string | object;
}
