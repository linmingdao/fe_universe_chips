import { initState } from './state.js';
import { compileToFunction } from './compiler/index.js';

export default function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    this.$options = options; // vue中会判断，如果是$开头的属性不会被变成响应式

    // 初始化状态，需要初始化的有哪些东西： props、data、methods、watch、computed
    initState(vm);

    console.log('vue劫持后的实例:', vm);

    // 状态初始化完毕后，需要进行挂载逻辑
    // 写 el 属性 和 手动调用 $mount 是一样的
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  Vue.prototype.$mount = function (el) {
    const vm = this;
    // 用户可能有传 render、template
    el = document.querySelector(el);
    const options = vm.$options;
    if (!options.render) {
      let template = options.template;
      if (!template) {
        template = el.outerHTML;
      }
      // 将template变成render函数
      const render = compileToFunction(template); // 开始模板编译
      options.render = render;
    }
    options.render; // 代码走到这里options.render就一定存在了

    console.log('$mount后的实例情况:', vm);
  };

  // diff 算法，主要是两个虚拟节点的比对，我们需要根据模板渲染出render函数
  // render函数返回一个虚拟节点，数据更新重新调用render函数，可以再返回一个虚拟节点
}
