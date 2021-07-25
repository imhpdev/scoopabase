/**
 * To get Key value from an Object
 * @param obj Object in which key need to search
 * @param key key with `obj.key` format
 * @returns An object if found else returns undefined.
 */
export function getKeyValue(obj: any, key: string): any {
  const keys = key.split('.');
  const keyToSearch = keys[0];
  const newKey = keys.slice(1).join('.');

  if (Array.isArray(obj[keyToSearch])) {
    return obj[keyToSearch];
  } else if (typeof obj[keyToSearch] == 'object') {
    return getKeyValue(obj[keyToSearch], newKey);
  } else {
    return obj[keyToSearch];
  }
}

/**
 * To check if key exist or not in Obj.
 * @param obj Object in which key need to search
 * @param key key with `obj.key` format
 * @returns An object if true else returns false.
 */
export function isKeyExist(obj: any, key: string): boolean {
  const keys = key.split('.');
  const keyToSearch = keys[0];
  const newKey = keys.slice(1).join('.');

  if (Array.isArray(obj[keyToSearch])) {
    return obj[keyToSearch];
  } else if (typeof obj[keyToSearch] == 'object') {
    return getKeyValue(obj[keyToSearch], newKey);
  } else {
    return obj[keyToSearch];
  }
}
