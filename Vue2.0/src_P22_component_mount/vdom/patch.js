// oldVnode第一次挂载的时候是一个真实的根节点元素

import { isReservedTag } from '../util/index';

// 更新的时候会是老的虚拟节点，用于和即将更新的虚拟节点做dom diff
export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 组件的挂载
    return createElm(vnode);
  } else {
    const isRealElement = oldVnode.nodeType;
    // 第一次挂载（mount过程）
    if (isRealElement) {
      console.log('第一次挂载（mount过程）', oldVnode, vnode);
      const oldElm = oldVnode;
      // 需要获取父节点，将当前节点的下一个元素作为参照物，将他插入，之后删除老节点
      const parentNode = oldElm.parentNode;
      const el = createElm(vnode);
      parentNode.insertBefore(el, oldElm.nextSibling);
      parentNode.removeChild(oldElm);
      return el;
    }
    // 更新逻辑（update过程），diff算法
    else {
      console.log('更新逻辑（update过程）', oldVnode, vnode);
    }
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);
  }

  if (vnode.componentInstance) {
    return true;
  }
}

function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;

  // 原生标签 或者 vue组件
  if (typeof tag === 'string') {
    // 实例化组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }

    // 创建原生标签
    vnode.el = document.createElement(tag);
    // 更新属性
    updateProperties(vnode);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  }
  // 文本节点
  else {
    // 虚拟dom映射真实dom，方便后面更新
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProperties(vnode) {
  const el = vnode.el;
  const newProps = vnode.data;
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
