import { initState } from './state';

export default function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    this.$options = options; // vue中会判断，如果是$开头的属性不会被变成响应式

    // 初始化状态，需要初始化的有哪些东西： props、data、methods、watch、computed
    initState(vm);
  };
}
