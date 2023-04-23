import { isObject } from '@vue/shared';
import { ReactiveFlags, mutableHandler } from './baseHandler';

const reactiveMap = new WeakMap(); // key只能是对象

// 1、将数据转换成响应式，只能做对象的代理
// 2、实现同一个对象，代理多次，返回同一个代理
// 3、代理对象再次被代理，可以直接返回
// @ts-ignore
export function reactive(target: any) {
  if (!isObject(target)) return;

  if (target[ReactiveFlags.IS_REACTIVE]) return target;

  const exisitingProxy = reactiveMap.get(target);
  if (exisitingProxy) return exisitingProxy;

  // 没有重新定义属性，只是代理
  // @ts-ignore
  const proxy = new Proxy(target, mutableHandler);

  reactiveMap.set(target, proxy);

  return proxy;
}
