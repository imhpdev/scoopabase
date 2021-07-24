import * as uuid from 'uuid';

export const generateUUID = (): string => {
  var unordered = uuid.v1();
  return (
    unordered.substr(14, 4) +
    unordered.substr(9, 4) +
    unordered.substr(0, 8) +
    unordered.substr(19, 4) +
    unordered.substr(24, unordered.length)
  );
};
