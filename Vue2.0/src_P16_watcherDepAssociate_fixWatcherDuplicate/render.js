import { createElement, createTextNode } from './vdom/create-element.js';

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
}

// 编译模板生成的渲染函数
// function anonymous() {
//   with (this) { // render.call(vm)，with(this) --> name，age 会直接从 vm 上取，取值就会触发 get，从而触发依赖收集
//     return _c(
//       'div',
//       {
//         id: 'app',
//         key: 'app',
//         class: 'my-app',
//         style: {
//           color: '#650505',
//           background: '#adadff',
//           display: 'inline',
//           padding: '10px',
//         },
//         disabled: true,
//       },
//       _v('\n      abc name: ' + _s(name) + ', age: ' + _s(age) + ' def '),
//       _c('span', undefined, _v('hello world')),
//     );
//   }
// }
