// oldVnode第一次挂载的时候是一个真实的根节点元素
// 更新的时候会是老的虚拟节点，用于和即将更新的虚拟节点做dom diff
export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 第一次挂载（mount过程）
    console.log('第一次挂载（mount过程）', oldVnode, vnode);
    const oldElm = oldVnode;
    // 需要获取父节点，将当前节点的下一个元素作为参照物，将他插入，之后删除老节点
    const parentNode = oldElm.parentNode;
    const el = createElm(vnode);
    console.log(el);
    parentNode.insertBefore(el, oldElm.nextSibling);
    parentNode.removeChild(oldElm);
    return el;
  } else {
    // 更新逻辑（update过程），diff算法
    console.log('更新逻辑（update过程）', oldVnode, vnode);
  }
}

function createElm(vnode) {
  let { tag, data, children, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag); // 后续需要diff算法，拿虚拟节点比对后更新dom
    // 更新属性
    updateProps(vnode);
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProps(vnode) {
  const el = vnode.el;
  const props = vnode.data;
  for (let k in props) {
    if (k === 'style') {
      for (let sk in props.style) {
        el.style[sk] = props.style[sk];
      }
    } else if (k === 'class') {
      el.className = props.class;
    } else {
      el.setAttribute(k, props[k]);
    }
  }
}
