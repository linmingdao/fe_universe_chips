import { nextTick } from '../util/next-tick';

let queue = [];
let has = {};

function flushSchedulerQueue() {
  queue.forEach((watcher) => watcher.run(), 0);
  queue = [];
  has = {};
}

export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] === null || has[id] === undefined) {
    queue.push(watcher);
    has[id] = true;

    // 宏任务、微任务（Vue里面使用Vue.nextTick）
    // Vue.nextTick的底层降级方案：promise -> mutaionObserver -> setImmediate -> setTimeout
    // setTimeout(() => {
    //   queue.forEach((watcher) => watcher.run(), 0);
    //   queue = [];
    //   has = {};
    // });
    nextTick(flushSchedulerQueue);
  }
}
