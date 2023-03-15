import { mergeOptions } from '../util/index';

export default function initExtend(Vue) {
  // 为什么要有 子类 和 父类 (new Vue)
  // 创建子类，继承于父类，拓展的时候都拓展到自己身上
  Vue.extend = function (extendOptions) {
    const Sub = function VueComponent(options) {
      this._init(options);
    };

    Sub.prototype = Object.create(this.prototype);
    Sub.prototype.constructor = Sub;

    Sub.options = mergeOptions(this.options, extendOptions);
    // 类似的还有子类的 mixin、use、component 等等

    return Sub;
  };
}
