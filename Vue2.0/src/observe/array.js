// 原则，不能改变原生数组的方法，只是劫持用户创建出来的数组实例上的方法
// let arr = [1, 2, 3];
// arr.__proto__ = arrayPrototype;
// arr.concat => 在arrayPrototype没有被劫持，会调用原生Array上的concat
let oldArrayPrototype = Array.prototype;
let arrayPrototype = Object.create(oldArrayPrototype); // 这个的目的是：arrayPrototype.__proto__ = Array.prototype
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
methods.forEach((method) => {
  arrayPrototype[method] = function (...args) {
    console.log('劫持数组方法', method, '触发视图更新');
    oldArrayPrototype[method].call(this, ...args);
  };
});

export default arrayPrototype;
