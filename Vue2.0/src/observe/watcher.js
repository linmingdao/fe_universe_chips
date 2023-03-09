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
    pushTarget(this); // 把watcher存起来
    this.getter(); // 渲染watcher的执行
    popTarget(); // 移除watcher
  }

  update() {
    this.get();
  }
}

export default Watcher;
