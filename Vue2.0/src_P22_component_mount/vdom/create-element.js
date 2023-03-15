import { isObject, isReservedTag } from '../util/index';

// render 函数中的 _c 方法
export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }

  // 原始标签
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, key, children, null);
  }
  // vue 组件
  else {
    // 找到组件的定义
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor);
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor);
  }

  data.hook = {
    init(vnode) {
      let child = (vnode.componentInstance = new Ctor({ _isComponent: true }));
      child.$mount();
    },
    inserted() {},
  };

  return vnode(
    vm,
    `vue-component-${Ctor.cid}-${tag}`,
    data,
    key,
    undefined,
    undefined,
    { Ctor, children },
  );
}

// render 函数中的 _v 方法
export function createTextNode(vm, text) {
  return vnode(vm, null, null, null, null, text);
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
    componentOptions,
  };
}
