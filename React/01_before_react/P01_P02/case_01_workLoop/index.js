function sleep(/* 单位毫秒 */ t) {
  const now = Data.now();
  while (Date.now() - now < t) {}
}

const works = [
  () => {
    console.log('开始任务1');
    sleep(20);
    console.log('结束任务1');
  },
  () => {
    console.log('开始任务2');
    sleep(20);
    console.log('结束任务2');
  },
  () => {
    console.log('开始任务3');
    sleep(20);
    console.log('结束任务3');
  },
];

function workLoop(deadline) {
  console.log(`本帧的剩余时间：${deadline.timeRemaining()}`);

  // 如果有空闲时间 或者任务已经超时，则执行任务
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    works.length
  ) {
    performUnitOfWork();
  }

  // 如果没有剩余时间，需要放弃执行任务的控制权，将控制权交给浏览器（等待浏览器下一次空闲时间继续执行任务）
  if (works.length) {
    requestIdleCallback(workLoop, { timeout: 1000 });
  }
}

function performUnitOfWork() {
  if (works.length) {
    works.shift()();
  }
}

requestIdleCallback(workLoop, { timeout: 1000 });
