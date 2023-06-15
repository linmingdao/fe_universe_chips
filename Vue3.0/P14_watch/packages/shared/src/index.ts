export const isObject = (value: any) =>
  typeof value === 'object' && value !== null;

export const isPlainObject = (val: unknown): val is object =>
  toTypeString(val) === '[object Object]';

export const isFunction = (value: any) => typeof value === 'function';

export const isArray = Array.isArray;

export const assign = Object.assign;

export const isString = (value: any) => typeof value === 'string';

export const isNumber = (value: any) => typeof value === 'number';

export const objectToString = Object.prototype.toString;

export const toTypeString = (value: unknown): string =>
  objectToString.call(value);

export const isMap = (val: unknown): val is Map<any, any> =>
  toTypeString(val) === '[object Map]';

export const isSet = (val: unknown): val is Set<any> =>
  toTypeString(val) === '[object Set]';
