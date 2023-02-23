let element = (
  <div id="A1">
    <div id="B1">
      <div id="C1"></div>
      <div id="C2"></div>
    </div>
    <div id="B2"></div>
  </div>
);
let root = document.getElementById('root');

// 下一个工作单元
// fiber 其实也是一个普通的JS对象
let workInProgressRoot = {
  stateNode: root, // 此fiber对应的DOM节点
  props: {
    children: [element],
  },
};
let nextUnitOfWork = workInProgressRoot;
const PLACEMENT = 'PLACEMENT';

// 定义一个工作循环
function workloop(deadline) {
  console.log('开始工作循环');
  while (nextUnitOfWork && deadline.timeRemaining() > 0) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork) {
    commitRoot();
  }
}

function commitRoot() {
  let currentFiber = workInProgressRoot.firstEffect;
  while (currentFiber) {
    console.log('commitRoot:', currentFiber.props.id);
    if (currentFiber.effectTag === 'PLACEMENT') {
      currentFiber.return.stateNode.appendChild(currentFiber.stateNode);
    }
    currentFiber = currentFiber.nextEffect;
  }
  workInProgressRoot = null;
}

/**
 * beginWork 1. 创建此Fiber的真实DOM
 * 通过虚拟DOM创建Fiber树结构
 * @param {*} workingInProgressFiber
 */
function performUnitOfWork(workingInProgressFiber) {
  beginWork(workingInProgressFiber);
  if (workingInProgressFiber.child) {
    return workingInProgressFiber.child;
  }
  while (workingInProgressFiber) {
    // 如果没有儿子当前节点其实就结束了
    completeUnitOfWork(workingInProgressFiber);
    if (workingInProgressFiber.sibling) {
      return workingInProgressFiber.sibling;
    }
    workingInProgressFiber = workingInProgressFiber.return;
  }
}

function completeUnitOfWork(workingInProgressFiber) {
  console.log('completeUnitOfWork', workingInProgressFiber.props.id);
  // 构建副作用链，上面只有副作用的节点
  let returnFiber = workingInProgressFiber.return; // A1
  if (returnFiber) {
    // 把当前fiber有副作用的子链表挂载到父身上
    if (!returnFiber.firstEffect) {
      returnFiber.firstEffect = workingInProgressFiber.firstEffect;
    }
    if (workingInProgressFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber.firstEffect;
      }
      returnFiber.lastEffect = workingInProgressFiber.lastEffect;
    }
    if (workingInProgressFiber.effectTag) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = workingInProgressFiber;
      } else {
        returnFiber.firstEffect = workingInProgressFiber;
      }
      returnFiber.lastEffect = workingInProgressFiber;
    }
  }
}

function beginWork(workingInProgressFiber) {
  console.log('beginWork', workingInProgressFiber.props.id);
  if (!workingInProgressFiber.stateNode) {
    workingInProgressFiber.stateNode = document.createElement(
      workingInProgressFiber.type,
    );
  }
  for (let key in workingInProgressFiber.props) {
    if (key !== 'children')
      workingInProgressFiber.stateNode[key] = workingInProgressFiber.props[key];
  } // 在beginwork 里面是不挂载的
  // 创建子Fiber
  let previousFiber;
  Array.isArray(workingInProgressFiber.props.children) &&
    workingInProgressFiber.props.children.forEach((child, index) => {
      let childFiber = {
        type: child.type, // DOM节点类型
        props: child.props,
        return: workingInProgressFiber,
        effectTag: PLACEMENT, // 这个fiber必须要插入到父节点中
        nextEffect: null, // 下一个副作用节点
      };
      if (index === 0) {
        workingInProgressFiber.child = childFiber;
      } else {
        previousFiber.sibling = childFiber;
      }
      previousFiber = childFiber;
    });
}

// 空闲时间
requestIdleCallback(workloop);
