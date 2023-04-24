import { isObject } from '@vue/shared';
import { ReactiveFlags, mutableHandler } from './baseHandler';

const reactiveMap = new WeakMap(); // key只能是对象

// 1、将数据转换成响应式，只能做对象的代理
// 2、实现同一个对象，代理多次，返回同一个代理
// 3、代理对象再次被代理，可以直接返回
export function reactive(target: any) {
  if (!isObject(target)) return;

  /**
   * 防止再次对已经是proxy的进行reactive(proxy)
   * const data = { name: '小明', age: 13, address: { num: 517 } };
   * const state1 = reactive(data);
   * const state2 = reactive(state1);
   */
  if (target[ReactiveFlags.IS_REACTIVE]) return target;

  /**
   * 防止再次对data进行reactive(data)
   * const data = { name: '小明', age: 13, address: { num: 517 } };
   * const state1 = reactive(data);
   * const state2 = reactive(data);
   */
  const exisitingProxy = reactiveMap.get(target);
  if (exisitingProxy) {
    debugger;
    return exisitingProxy;
  }

  // 与vue2的显著区别是：没有一上来就递归遍历整个对象重新定义属性，只是代理
  const proxy = new Proxy(target, mutableHandler);

  // 防止二次代理，代理过的就丢进这个map中去方便做判断
  reactiveMap.set(target, proxy);

  return proxy;
}
