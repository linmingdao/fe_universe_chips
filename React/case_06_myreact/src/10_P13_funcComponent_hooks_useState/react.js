import { ELEMENT_TEXT } from './constants';
import { Update } from './updateQueue';
import { scheduleRoot, useReducer, useState } from './scheduler';

/**
 * 创建元素（虚拟DOM）的方法
 * @param {*} type  元素的类型 div span p
 * @param {*} config 配置对象 属性 key ref
 * @param  {...any} children 所有的儿子，这里整成一个数组
 */
function createElement(type, config, ...children) {
  return {
    type,
    props: {
      ...config, // 属性扩展 id，key
      children: children.map((child) => {
        // 兼容处理，如果是react元素返回自己，如果是文本类型，如果是一个字符串的话，返回元素对象
        // 比方说B1文本那么就是["B1文本"]改为了
        // {type:Symbol(ELEMENT_TEXT),props:{text:"B1文本",children:[]}}也不可能有children了
        return typeof child === 'object'
          ? child
          : {
              type: ELEMENT_TEXT,
              props: { text: child, children: [] },
            };
      }),
    },
  };
}

class Component {
  constructor(props) {
    this.props = props;
  }

  /**
   *
   * @param {Function|Object} payload 可能是对象或者函数
   */
  setState(payload) {
    let update = new Update(payload);
    // updateQueue其实是放在此类组件对应的fiber节点的 internalFiber
    this.internalFiber.updateQueue.enqueueUpdate(update);
    scheduleRoot(); // 从根节点开始调度
  }
}

Component.prototype.isReactComponent = {};

const React = { createElement, Component, useReducer, useState };

export default React;
