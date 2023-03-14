let id = 0;
let stack = [];

class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // age: [watcher, watcher, ...]
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  // 收集依赖
  depend() {
    // 让这个watcher记住当前的dep（也等于watcher记住了属性，即：watcher(渲染) <--> 属性）
    // this.subs.push(Dep.target); // 这样会重复添加watcher
    Dep.target.addDep(this);
  }

  // 派发更新
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

// 全局静态属性
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
