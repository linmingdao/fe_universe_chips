import { pushTarget, popTarget } from './dep.js';

let id = 0;

class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.id = id++;

    this.vm = vm;
    this.callback = callback;
    this.options = options;

    this.getter = exprOrFn;

    this.get(); // 调用get方法会让渲染过程执行
  }

  get() {
    // 【利用js单线程】把watcher存在静态属性 Dep.target 上
    pushTarget(this);

    // 渲染watcher的执行 --> updateComponent
    // --> vm._render() --> 触发get方法 --> 触发依赖收集 dep.depend() 将 watcher 收集到自己字段的 dep 的 subs 里
    // --> vm._update()
    this.getter();

    // 移除watcher，Dep.target
    popTarget();
  }

  update() {
    this.get();
  }
}

export default Watcher;
