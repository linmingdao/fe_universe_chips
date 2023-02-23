import React from 'react';
// import ReactDOM from 'react-dom/client';

// JSX React 语法糖 描述UI界面
let element = (
  <div id="0" className="red">
    <div id="1">1</div>
    <div id="2">2</div>
  </div>
);
console.log(JSON.stringify(element, null, 2));

// 将元素渲染到界面
// 如果界面节点多，层次深的，递归渲染比较耗时
// JS 是单线程的，而且UI线程和JS线程互斥
function render(element, rootParent) {
  console.log('执行render');
  // 1. 创建元素 document.createElement
  let dom = document.createElement(element.type);
  console.log(dom);

  // 2. 将元素上的属性添加上去
  // console.log(Object.keys(element.props));
  Object.keys(element.props)
    .filter((prop) => prop !== 'children')
    .forEach((v) => {
      dom[v] = element.props[v];
    });

  // 3. 将子元素进行渲染
  if (Array.isArray(element.props.children)) {
    element.props.children.forEach((c) => render(c, dom));
  } else {
    dom.innerHTML = element.props.children;
  }

  rootParent.appendChild(dom);
}

render(element, document.getElementById('root'));

// ReactDOM.render(element, document.getElementById("root"));
