export function lifeCycleMixin(Vue) {
  // 实现render函数中的 c、v、s函数
  Vue.prototype._c = function () {
    console.log('_c', arguments);
  };
  Vue.prototype._v = function () {
    console.log('_v', arguments);
  };
  Vue.prototype._s = function (value) {
    console.log('_s', value);
    return JSON.stringify(value);
  };

  // vm._render()：生成虚拟节点
  Vue.prototype._render = function () {
    const vm = this;
    const render = vm.$options.render;
    // 在没有实现 c、v、s 函数时调用 render 函数是会报错的
    const vnode = render.call(vm);
    return vnode;
  };

  // vm._update()：虚拟节点变成真实dom，渲染到页面上
  Vue.prototype._update = function (vnode) {
    console.log(vnode);
  };
}

// 实现挂载流程
export function mountComponent(vm, el) {
  // 调用生成的render函数 -> 获取到虚拟节点 -> 生成真实dom -> 渲染到页面上
  const updateComponent = () => {
    // vm._render()：生成虚拟节点
    // vm._update()：虚拟节点变成真实dom(dom diff)，渲染到页面上
    vm._update(vm._render());
  };

  // 立即调用它，完成挂载的绘制流程会调用它，
  // 挂载会调用它，如果稍后数据变化，更新组件也会调用它（观察者模式）
  updateComponent();
}
