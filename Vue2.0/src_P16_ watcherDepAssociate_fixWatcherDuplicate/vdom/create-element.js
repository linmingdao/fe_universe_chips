// render 函数中的 _c 方法
export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }
  return vnode(vm, tag, data, key, children, null);
}

// render 函数中的 _v 方法
export function createTextNode(vm, text) {
  return vnode(vm, null, null, null, null, text);
}

function vnode(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    children,
    key,
    text,
  };
}
