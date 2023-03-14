import { pushTarget, popTarget } from './dep.js';

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.id = id++;

    this.vm = vm;
    this.callback = callback;
    this.options = options;

    this.getter = exprOrFn;

    this.depsId = new Set(); // es集合，不能放重复性数据
    this.deps = [];

    this.get(); // 调用get方法会让渲染过程执行
  }

  addDep(dep) {
    // watcher里不放重复的dep，同样，dep不放重复的watcher
    let id = dep.id;
    if (!this.depsId.has(id)) {
      // watcher记住dep
      this.depsId.add(id);
      this.deps.push(dep);

      // dep记住watcher
      dep.addSub(this);
    }
  }

  get() {
    // 【利用js单线程】把watcher存在静态属性 Dep.target 上
    pushTarget(this);

    // 渲染watcher的执行 --> updateComponent -->
    // --> vm._render() --> 触发get方法 --> 触发依赖收集 dep.depend() 将 watcher 收集到自己字段的 dep 的 subs 里 -->
    // --> vm._update()
    this.getter();

    // 移除watcher，Dep.target
    popTarget();
  }

  update() {
    // 等待着，一起更新
    // this.get();
    queueWatcher(this);
  }

  run() {
    this.get();
  }
}

let queue = [];
let has = {};
function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] === null || has[id] === undefined) {
    queue.push(watcher);
    has[id] = true;
    setTimeout(() => {
      queue.forEach((watcher) => watcher.run(), 0);
      queue = [];
      has = {};
    });
  }
}

export default Watcher;
