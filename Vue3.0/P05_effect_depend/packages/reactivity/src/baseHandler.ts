import { activeEffect, track } from './effect';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandler = {
  get(target: Object, key: string, receiver: ProxyConstructor) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    track(target, 'get', key);

    return Reflect.get(target, key, receiver);
  },
  set(target: Object, key: string, value: any, receiver: ProxyConstructor) {
    return Reflect.set(target, key, value, receiver);
  },
};
