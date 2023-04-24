// 利用js单线程、es5 模块输出的是引用(可以时时获取最新的值)
// @ts-ignore
export let activeEffect;

class ReactiveEffect {
  // 这个effect默认是激活状态
  active = true;

  constructor(public fn: Function) {}

  // 执行effect
  run() {
    // 这里表示如果是非激活情况，只需要执行函数，不需要依赖收集
    if (!this.active) return this.fn();

    try {
      debugger;
      // 利用单线程，这里需要依赖收集，核心就是将当前的 effect 和 稍后渲染的属性【互相关联】在一起
      activeEffect = this;
      // fn调用取值操作的时候（触发proxy的get、set），就可以获取到这个全局的 activeEffect
      return this.fn();
    } finally {
      activeEffect = undefined;
    }
  }
}

// 1、用户指定的fn可以根据状态变化重新执行
// 2、effect 跟 react useEffect 不一样的是，他会自动进行依赖收集（更加智能的依赖收集），而useEffect需要手动提供依赖（更加精细的依赖收集）
// 3、effect可以嵌套写
export function effect(fn: Function) {
  // 创建响应式的effect
  const _effect = new ReactiveEffect(fn);
  // 默认先执行一次
  _effect.run();
}
