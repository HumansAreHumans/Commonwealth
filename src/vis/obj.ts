type ForEachFn = (value: any, key?: string) => void;
type ReduceFn = (result: any, value: any, key?: string) => any;
type MapFn = (value: any, key?: string) => any;

export const forEach = (fn: ForEachFn) => (obj: any) =>
  Object.keys(obj).forEach(key => fn(obj[key], key));
export const reduce = (fn: ReduceFn) => (defaultVal: any) => (obj: any) =>
  Object.keys(obj).reduce((val, key) => fn(val, obj[key], key), defaultVal);
export const map = (fn: MapFn) => (obj: any) =>
  Object.keys(obj).map(key => fn(obj[key], key));
