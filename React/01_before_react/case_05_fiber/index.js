/* 
Fiber是一个执行单元
    1. Fiber是一个执行单元，类似对象。每次执行完一个执行单元，react会检查可使用的时间还有多少，如果没时间就把控制权让出去
    2. 通过Fiber架构，让Reconcilation过程变成可被中断，适时会让出CPU执行权，让浏览器优先处理用户的交互

Fiber执行阶段
    每次渲染包含2个阶段：Reconcilation(协调或render渲染)和Commit(提交阶段)
    协调阶段：Reconcilation可以认为是diff阶段，该阶段可被中断，会造成节点变更，如新增、删除等，这些变更react称为副作用effect
    提交阶段：将上一个阶段计算出来的所有需要处理的副作用一次性执行。这个阶段必须同步执行，不能被打断
 **/
let rootFiber = require('./elements');

let nextUnitOfWork; // 下一个执行单元

function workLoop() {
  while (nextUnitOfWork) {
    // 如果有待执行的执行单元，就执行，会返回下一个执行单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork) {
    console.log('render阶段结束');
  }
}

// 深度优先遍历
function performUnitOfWork(fiber) {
  beginWork(fiber);
  if (fiber.child) {
    //如果有子，返回第一个子节点 A1之后B1
    return fiber.child;
  }
  while (fiber) {
    // 如果没有子，说明该节点完成。
    completeUnitOfWork(fiber);
    // 节点自身完成，开始查看是否有兄弟节点，如果有返回兄弟节点
    if (fiber.sibling) {
      return fiber.sibling;
    }
    // 兄弟节点也遍历完毕，则返回父节点，让父节点再次查找兄弟节点，即该节点的叔叔节点。
    fiber = fiber.return;
  }
}

function completeUnitOfWork(fiber) {
  console.log(fiber.key, 'end');
}

function beginWork(fiber) {
  console.log(fiber.key, 'start');
}

nextUnitOfWork = rootFiber;

workLoop();
