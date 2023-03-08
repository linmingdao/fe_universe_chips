import Watcher from './observe/watcher.js';
import { patch } from './vdom/patch.js';

export function lifeCycleMixin(Vue) {
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

// 实现挂载流程
export function mountComponent(vm, el) {
  // 先将el挂到实例上
  vm.$el = el;

  // 调用生成的render函数 -> 获取到虚拟节点 -> 生成真实dom -> 渲染到页面上
  const updateComponent = () => {
    // vm._render()：生成虚拟节点
    // vm._update()：虚拟节点变成真实dom(dom diff)，渲染到页面上
    vm._update(vm._render());
  };

  // 通过Watcher进行调用
  // 更新逻辑走发布订阅，渲染watcher，每个组件都会有个watcher
  new Watcher(
    vm,
    updateComponent,
    () => {} /* vm.$watch 的回调 */,
    true /* 表示他是一个渲染watcher */,
  );
  // 如果不考虑更新逻辑，这里也可以立即调用updateComponent，完成挂载的绘制流程会调用它，
  // 挂载会调用它，如果稍后数据变化，更新组件也会调用它（观察者模式 + 依赖收集 + diff）
  // updateComponent();
}
