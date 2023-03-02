// 这里才是响应式原理的核心
export function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return;
  }

  // 如果一个对象已经被观测过了（存在 __ob__），那么不要再次被观测
  return new Observer(data);
}

class Observer {
  constructor(data) {
    this.walk(data);
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
