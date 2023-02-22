import {
  TAG_TEXT,
  TAG_HOST,
  ELEMENT_TEXT,
  TAG_CLASS,
  PLACEMENT,
  TAG_FUNCTION_COMPONENT,
} from './constants';
import { UpdateQueue } from './updateQueue';

export function setProps(dom, oldProps, newProps) {
  for (let key in oldProps) {
    if (key !== 'children') {
      if (newProps.hasOwnProperty('key')) {
        // 新老都有更新
        setProp(dom, key, newProps[key]);
      } else {
        // 老的有新的没有删除
        dom.removeAttribute(key);
      }
    }
  }
  for (let key in newProps) {
    if (key !== 'children') {
      if (!oldProps.hasOwnProperty('key')) {
        // 老的没有新的有，添加
        setProp(dom, key, newProps[key]);
      }
    }
  }
}

function setProp(dom, key, value) {
  if (/^on/.test(key)) {
    // 处理事件
    dom[key.toLowerCase()] = value; // 没有用合成事件
  } else if (key === 'style') {
    if (value) {
      for (let styleName in value) {
        if (value.hasOwnProperty(styleName)) {
          dom.style[styleName] = value[styleName];
        }
      }
    }
  } else {
    dom.setAttribute(key, value);
  }
  return dom;
}

export function isSameType(newChild, oldFiber) {
  if (oldFiber) {
    if (newChild) {
      if (typeof newChild === 'string') {
        return oldFiber.type === ELEMENT_TEXT;
      } else {
        return oldFiber.type === newChild.type;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export function convertTextNode(newChild) {
  return typeof newChild === 'string' ? { text: newChild } : newChild.props;
}

export function createSimilarFiber(currentFiber, newChild) {
  let tag;
  let type;
  let props;
  if (
    typeof newChild.type == 'function' &&
    newChild.type.prototype.isReactComponent
  ) {
    // 是类组件
    tag = TAG_CLASS;
    type = newChild.type;
    props = newChild.props;
  } else if (newChild && typeof newChild.type == 'function') {
    // 函数组件
    tag = TAG_FUNCTION_COMPONENT;
    type = newChild.type;
    props = newChild.props;
  } else if (typeof newChild === 'string') {
    // 文本节点
    tag = TAG_TEXT;
    type = ELEMENT_TEXT;
    props = convertTextNode(newChild);
  } else if (typeof newChild.type === 'string') {
    // 如果type是字符串，那么这是一个原生DOM节点（比如：div）
    tag = TAG_HOST;
    type = newChild.type;
    props = newChild.props;
  }

  return {
    tag,
    type,
    props,
    stateNode: null, // 还没有创建DOM元素
    return: currentFiber, // 父Fiber returnFiber
    effectTag: PLACEMENT, // 副作用标示，render会收集副作用 增加 删除 更新
    updateQueue: new UpdateQueue(),
    nextEffect: null, // effect list也是一个单链表 顺序和完成顺序一样 节点可能会少
  };
}
