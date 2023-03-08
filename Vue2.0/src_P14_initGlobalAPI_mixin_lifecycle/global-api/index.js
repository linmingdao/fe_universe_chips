import { mergeOptions } from '../util/index.js';

export function initGlobalAPI(Vue) {
  // 整合了所有的全局相关的内容
  Vue.options = {};

  Vue.mixin = function (mixin) {
    // 如何实现两个对象的合并
    this.options = mergeOptions(this.options, mixin);
  };

  // Vue.mixin用法
  // 生命周期的合并策略，[beforeCreate, beforeCreate]
  Vue.mixin({
    a: 1,
    beforeCreate() {
      console.log('mixin 1 beforeCreate');
    },
  });
  Vue.mixin({
    b: 2,
    beforeCreate() {
      console.log('mixin 2 beforeCreate');
    },
  });
  console.log(Vue.options);
}
