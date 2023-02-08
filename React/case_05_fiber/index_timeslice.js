/* 
Fiber是一个执行单元
    1. Fiber是一个执行单元，类似对象。每次执行完一个执行单元，react会检查可使用的时间还有多少，如果没时间就把控制权让出去
    2. 通过Fiber架构，让Reconcilation过程变成可被中断，适时会让出CPU执行权，让浏览器优先处理用户的交互

Fiber执行阶段
    每次渲染包含2个阶段：Reconcilation(协调或render渲染)和Commit(提交阶段)
    协调阶段：Reconcilation可以认为是diff阶段，该阶段可被中断，会造成节点变更，如新增、删除等，这些变更react称为副作用effect
    提交阶段：将上一个阶段计算出来的所有需要处理的副作用一次性执行。这个阶段必须同步执行，不能被打断
 **/

// Fiber mock data
let A1 = { type: 'div', key: 'A1' };
let B1 = { type: 'div', key: 'B1', return: A1 };
let B2 = { type: 'div', key: 'B2', return: A1 };
let C1 = { type: 'div', key: 'C1', return: B1 };
let C2 = { type: 'div', key: 'C2', return: B1 };
A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

// Fiber root
let rootFiber = A1;
let nextUnitOfWork; // 下一个执行单元

function workLoop(deadline) {
  // 如果有空闲时间 或者任务已经超时，并且还有下一个待执行的工作单元，则执行任务
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    nextUnitOfWork
  ) {
    // 如果有待执行的执行单元，就执行，performUnitOfWork会返回下一个执行单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // 如果没有剩余时间，需要放弃执行任务的控制权，将控制权交给浏览器（等待浏览器下一次空闲时间继续执行任务）
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop, { timeout: 1000 });
  } else {
    console.log('render阶段结束');
  }
}

// 深度优先遍历 -> 但是并非是递归形式的深度优先算法 -> 如何解决dom嵌套过深导致的耗时问题 -> 引入时间切片技术
function performUnitOfWork(fiber) {
  beginWork(fiber);
  if (fiber.child) {
    // 如果有子，返回第一个子节点（A1之后B1）
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
    // 此处没有return，在配合while循环，做到不重复遍历父节点
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

requestIdleCallback(workLoop, { timeout: 1000 });
