import { isObject } from '@vue/shared';
import { track, trigger } from './effect';
import { reactive } from './reactive';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandler = {
  // @ts-ignore
  get(target: Object, key: string, receiver: ProxyConstructor) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    // 依赖收集
    track(target, 'get', key);

    let res = Reflect.get(target, key, receiver);

    if (isObject(res)) {
      return reactive(res);
    }

    return res;
  },
  set(target: any, key: string, value: any, receiver: ProxyConstructor) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);

    // 派发更新
    if (oldValue !== value) trigger(target, 'set', key, value, oldValue);

    return result;
  },
};
