import { isObject } from '@vue/shared';
import { TrackOpTypes, TriggerOpTypes, track, trigger } from './effect';
import { ReactiveFlags, Target, reactive } from './reactive';

export const mutableHandler: ProxyHandler<object> = {
  get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) return true;

    // 依赖收集
    track(target, TrackOpTypes.GET, key);

    const res = Reflect.get(target, key, receiver);

    if (isObject(res)) {
      return reactive(res);
    }

    return res;
  },
  set(target: Target, key: string | symbol, value: unknown, receiver: object) {
    const oldValue = target[key];
    const result = Reflect.set(target, key, value, receiver);

    // 派发更新
    if (oldValue !== value) {
      trigger(target, TriggerOpTypes.SET, key, value, oldValue);
    }

    return result;
  },
};
