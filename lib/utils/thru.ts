export function thru<T, R>(value: T, consumer: (value: T) => R) {
  return consumer(value);
}
