export function mapValues<T extends object, const R>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T, obj: T) => R
) {
  return (Object.keys(obj) as (keyof T)[]).reduce((acc, k) => {
    acc[k] = mapper(obj[k], k, obj);
    return acc;
  }, {} as { [key in keyof T]: R });
}
