export interface InstanceMetaData {
  name: string;
  storeName: string;
}

export interface CollectionDictionary {
  [key: string]: any;
}

interface IScoopaDocument {
  value: any;
}

export interface ScoopaDocument extends IScoopaDocument {
  key: string;
  value: any;
}
