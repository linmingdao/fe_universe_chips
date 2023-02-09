let nextUnitOfWork = null; // 下一个工作单元
let workInProgressRoot = null; // RootFiber应用的根

/**
 * 从根节点开始渲染和调度
 * 两个阶段（diff+render阶段，commit阶段）
 * diff+render阶段 对比新旧虚拟DOM，进行增量更新或创建
 * 花时间长，可进行任务拆分，此阶段可暂停
 * render阶段的成果是effect list知道哪些节点更新哪些节点增加删除了
 * render阶段两个任务：1.根据虚拟DOM生成fiber树 2.收集effectlist
 * commit阶段，进行DOM更新创建阶段，此间断不能暂停
 * @param { tag: TAG_ROOT, stateNode: container, props: { children: [element] } rootFiber
 */
export function scheduleRoot(rootFiber) {
  console.log('rootFiber：', rootFiber);
  nextUnitOfWork = rootFiber;
  workInProgressRoot = rootFiber;
}

function performUnitOfWork(currentFiber) {
  beginWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child; // 有孩子返回孩子
  }
  while (currentFiber) {
    completeUnitOfWork(currentFiber);
    if (currentFiber.sibling) {
      return currentFiber.sibling; // 有弟弟返回弟弟
    }
    currentFiber = currentFiber.return; // 返回父亲
  }
}

/**
 * 回调返回浏览器空闲时间，判断是否继续执行任务
 * @param {*} deadline
 */
function workLoop(deadline) {
  let shouldYield = false; // react是否要让出时间或说控制权
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    console.log('render阶段结束');
  }

  // 每一帧都要执行这个代码
  window.requestIdleCallback(workLoop, { timeout: 500 });
}

/**
 * beginWork开始遍历每一个节点
 *
 * 1.创建真实DOM元素
 * 2.创建子fiber
 * @param {*} currentFiber
 */
function beginWork(currentFiber) {
  console.log(`start：${currentFiber.key}`);
}

/**
 * 在完成时收集副作用 组成effect list
 * 每个fiber有两个属性 firstEffect指向第一个有副作用的子fiber
 * lastEffect指向最后一个有副作用的子fiber，中间用nextEffect做成单链表
 * @param {*} currentFiber
 */
function completeUnitOfWork(currentFiber) {
  console.log(`end：${currentFiber.key}`);
}

//react询问浏览器是否空闲，这里有个优先级的概念 expirationTime
window.requestIdleCallback(workLoop, { timeout: 500 });
