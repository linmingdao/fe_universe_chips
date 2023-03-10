let id = 0;
let stack = [];

class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // age: [watcher, watcher, ...]
  }
  // 收集依赖
  depend() {
    this.subs.push(Dep.target);
  }
  // 派发更新
  notify() {
    this.subs.forEach((watcher) => {
      watcher.update();
    });
  }
}

Dep.target = null;

export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}

export default Dep;
