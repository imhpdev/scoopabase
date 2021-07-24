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
