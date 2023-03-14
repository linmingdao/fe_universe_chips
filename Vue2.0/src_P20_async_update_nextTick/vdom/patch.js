// oldVnode第一次挂载的时候是一个真实的根节点元素
// 更新的时候会是老的虚拟节点，用于和即将更新的虚拟节点做dom diff
export function patch(oldVnode, vnode) {
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

function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;

  // 原生标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag); // 后续需要diff算法，拿虚拟节点比对后更新dom
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
