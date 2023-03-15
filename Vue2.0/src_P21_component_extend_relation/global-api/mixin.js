import { mergeOptions } from '../util/index.js';

export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    // 如何实现两个对象的合并
    this.options = mergeOptions(this.options, mixin);
  };
}
