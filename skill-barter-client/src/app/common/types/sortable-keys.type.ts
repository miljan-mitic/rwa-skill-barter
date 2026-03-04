export type SortableKeys<T> = {
  [K in keyof T]: T[K] extends string | number | boolean | Date ? K : never;
}[keyof T];
