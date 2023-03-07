import { createElement, createTextNode } from './vdom/index.js';
import { patch } from './vdom/patch.js';

export function renderMixin(Vue) {
  // 实现render函数中的 c、v、s函数
  // _c 创建元素的虚拟节点
  // _v 创建文本的虚拟节点
  // _s JOSN.stringfy
  Vue.prototype._c = function () {
    console.log('_c', arguments);
    return createElement(this, ...arguments);
  };

  Vue.prototype._v = function () {
    console.log('_v', arguments);
    return createTextNode(this, ...arguments);
  };

  Vue.prototype._s = function (value) {
    console.log('_s', value);
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  };

  // vm._render()：生成虚拟节点
  Vue.prototype._render = function () {
    const vm = this;
    const render = vm.$options.render;
    // 在没有实现 c、v、s 函数时调用 render 函数是会报错的
    console.log('======= render函数内部调用顺序 =======');
    const vnode = render.call(vm); // _c(_s, _v) with(this)
    console.log('======= render函数内部调用顺序 =======');
    console.log('render函数生成的虚拟dom情况:', vnode);
    return vnode;
  };

  // vm._update()：虚拟节点变成真实dom，渲染到页面上
  Vue.prototype._update = function (vnode) {
    // 将vnode渲染到el元素中
    const vm = this;

    // 这个patch有两个作用：
    // 1、mount，挂载流程（第一次的初始化流程的页面更新）
    // 2、update，后续更新也走这个patch方法
    vm.$el = patch(vm.$el, vnode);
  };
}
