/*
react 在16版本之前使用链表架构，不可中断的更新
1. react 会递归比对 virtualDOM 树，找出需要变动的节点，然后同步更新它们，这个过程叫 Reconcilation 协调
2. Reconcilation 期间，react 会一直占用着浏览器资源，如果该过程时间过长大于16.6ms，造成用户触发的事件得不到及时响应，给用户造成卡顿感觉
**/
let root = {
  key: 'A1',
  children: [
    {
      key: 'B1',
      children: [
        { key: 'C1', children: [] },
        { key: 'C2', children: [] },
      ],
    },
    {
      key: 'B2',
      children: [],
    },
  ],
};

function walk(element) {
  doWork(element);
  element.children.length > 0 && element.children.forEach(walk);
}

function doWork(element) {
  console.log(element.key);
}

walk(root);
