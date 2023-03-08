import arrayPrototype from './array.js';

// 这里才是响应式原理的核心
export function observe(data) {
  // typeof null --> 'object'，typeof undefined --> 'undefined'，
  // 所以此处需要再额外过滤掉 null 的情况
  if (typeof data !== 'object' || data === null) {
    return;
  }

  if (data.__ob__) {
    // 说明这个属性已经被代理过了，不需要重复代理
    return data;
  }

  // 如果一个对象已经被观测过了（存在 __ob__），那么不要再次被观测
  return new Observer(data);
}

class Observer {
  constructor(data) {
    // 下面这样写会死循环，因为 this.walk会遍历到 __ob__
    // data.__ob__ = this;
    // 需要下面这样写，给每个将要代理的属性，打上 __ob__ 标识，
    // 可以防止该属性被重复代理，其次，也可以方便地拿到该 Observer 实例上的方法
    // 比如在 array.js 里面 直接调用 ob.observeArray(inserted); 来继续代理数据push的对象
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
    });

    // 如果是数组的话，也用defineProperty，会对数组的每个下标进行劫持，会有性能问题，虽然可行，但是不建议这样做
    // 但是vue3中的polyfill直接就给数组这样做代理了
    // 改写数组的方法，如果用户调用了可以改写数组方法的api，那么我就去劫持这个方法
    // 变异方法：push、pop、shift、unshift、reverse、sort、splice
    // 修改数组的索引和长度是无法更新视图的
    if (Array.isArray(data)) {
      // 劫持能改变数组的7个方法
      data.__proto__ = arrayPrototype;
      // 如果数组里面放的是对象类型，那么我希望他也会变成响应式的
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }

  observeArray(data) {
    data.forEach((item) => observe(item));
  }

  walk(data) {
    // 循环对象，不用 for in（会遍历原型链）
    const keys = Object.keys(data);
    keys.forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

// 闭包，性能不好，原因在于所有的属性都被重新定义了一遍
// 一上来需要将对象深度代理，性能差
function defineReactive(data, key, value) {
  // 递归代理属性
  observe(value);

  // 属性会全部被重写增加get和set进行数据劫持
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    // vm.xxx
    get() {
      // 此处不可写成 return data[key]，会死循环
      return value;
    },
    // vm.xx = 123
    set(newValue) {
      if (newValue === value) return;
      // vm.xx = { a: 1 } 赋值一个对象，也可以有响应式
      observe(newValue);
      value = newValue;
    },
  });
}
