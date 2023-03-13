// 原则，不能改变原生数组的方法，只是劫持用户创建出来的数组实例上的方法
// let arr = [1, 2, 3];
// arr.__proto__ = arrayPrototype;

// arr.concat => 在arrayPrototype没有被劫持，会调用原生Array上的concat
let oldArrayPrototype = Array.prototype;
// 这个的目的是：arrayPrototype.__proto__ = Array.prototype
let arrayPrototype = Object.create(oldArrayPrototype);

// 需要劫持的方法
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];

// 开始劫持数组方法
methods.forEach((method) => {
  arrayPrototype[method] = function (...args) {
    let inserted;
    const ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // arr.splice(1,1,xxx)
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    // inserted一定是数组
    if (inserted) {
      // import { observe } from '.';
      // observe(inserted);
      ob.observeArray(inserted);
    }

    // console.log('劫持数组方法', method, '触发视图更新');
    const result = oldArrayPrototype[method].call(this, ...args);

    ob.dep.notify();

    return result;
  };
});

export default arrayPrototype;
