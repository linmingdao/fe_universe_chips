import { track, trigger } from './effect';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const mutableHandler = {
  get(target: Object, key: string, receiver: ProxyConstructor) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    // 依赖收集
    track(target, 'get', key);

    return Reflect.get(target, key, receiver);
  },
  set(target: any, key: string, value: any, receiver: ProxyConstructor) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);

    // 派发更新
    if (oldValue !== value) trigger(target, 'set', key, value, oldValue);

    return result;
  },
};
