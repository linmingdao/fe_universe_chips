export const isObject = (value: any) =>
  typeof value === 'object' && value !== null;

export const isFunction = (value: any) => typeof value === 'function';

export const isArray = Array.isArray;

export const assign = Object.assign;

export const isString = (value: any) => typeof value === 'string';

export const isNumber = (value: any) => typeof value === 'number';
