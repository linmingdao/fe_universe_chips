import {
  isArray,
  isFunction,
  isMap,
  isObject,
  isPlainObject,
  isSet,
} from '@vue/shared';
import { ReactiveEffect } from './effect';
import { ReactiveFlags, isReactive } from './reactive';
import { isRef } from './ref';

export function traverse(value: unknown, seen?: Set<unknown>) {
  if (!isObject(value) || (value as any)[ReactiveFlags.SKIP]) {
    return value;
  }
  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);

  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse((value as any)[key], seen);
    }
  }
  return value;
}

export function watch(source: any, cb: (newValue: any, oldValue: any) => void) {
  let getter: any;
  if (isReactive(source)) {
    // 对用户传入的数据进行递归循环，只要循环就会访问对象上的每个属性 -> 访问属性时候会收集 effect
    getter = () => traverse(source);
  } else if (isFunction(source)) {
    getter = source;
  } else {
    console.error('watch不支持该source类型', source);
    return;
  }

  let oldValue: any;
  const job = () => {
    const newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effect = new ReactiveEffect(getter, job);

  oldValue = effect.run();
}
