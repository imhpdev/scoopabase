export const getSingleton = () => {
  let singleton: any;
  return <T>(createSingleton: () => T): T => {
    if (!singleton) {
      singleton = createSingleton() as T;
    }
    return singleton;
  };
};
