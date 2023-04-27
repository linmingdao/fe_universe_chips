import { Target } from './reactive';

// 利用js单线程、es5 模块输出的是引用(可以时时获取最新的值)
export let activeEffect: ReactiveEffect | undefined;

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect); // 解除effect，重新依赖收集
  }
  effect.deps.length = 0;
}

export type Dep = Set<ReactiveEffect>;

export type EffectScheduler = (...args: any[]) => any;

export class ReactiveEffect<T = any> {
  parent: ReactiveEffect | undefined = undefined;
  // 这个effect默认是激活状态
  active = true;
  // effect记录被哪些属性收集了
  deps: Dep[] = [];

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
  ) {}

  // 执行effect
  run() {
    // 这里表示如果是非激活情况，只需要执行函数，不需要依赖收集
    if (!this.active) {
      return this.fn();
    }

    try {
      // 保证多个effect嵌套可以正确记录属性和effect的对应关系(之前是用栈进行实现)
      this.parent = activeEffect;
      // 这里需要依赖收集，核心就是将当前的 effect 和 稍后渲染的属性关联在一起
      activeEffect = this;

      // 执行前需要将之前收集的内容清空
      cleanupEffect(this);

      // 当稍后调用取值操作的时候，就可以获取到这个全局的 activeEffect
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }

  stop() {
    if (this.active) {
      cleanupEffect(this);
      this.active = false;
    }
  }
}

export interface ReactiveEffectOptions {
  scheduler?: EffectScheduler;
}

export interface ReactiveEffectRunner<T = any> {
  (): T;
  effect: ReactiveEffect;
}

/**
 * 1、fn可以根据状态变化重新执行
 * 2、effect 跟 react useEffect 不一样的是，他会自动进行依赖收集（更加智能的依赖收集），而useEffect需要手动提供依赖（更加精细的依赖收集）
 * 3、effect可以嵌套写
 */
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
): ReactiveEffectRunner {
  // 将回调函数fn转成响应式的（创建响应式的effect）
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  // 默认先执行一次
  _effect.run();

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner;
  runner.effect = _effect;

  return runner;
}

export const enum TrackOpTypes {
  GET = 'get',
}

export const enum TriggerOpTypes {
  SET = 'set',
}

type KeyToDepMap = Map<any, Dep>;
const targetMap = new WeakMap<any, KeyToDepMap>();

/**
 * 1、收集依赖，单向记录（属性记录effect）
 * 2、反向记录，effect也记录被哪些属性收集，这样的处理是方便清理
 */
export function track(target: Target, type: TrackOpTypes, key: unknown) {
  if (!activeEffect) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));

  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));

  trackEffects(dep);
}

export function trackEffects(dep: Set<ReactiveEffect>) {
  if (!activeEffect) return;

  let shouldTrack = !dep.has(activeEffect);
  if (shouldTrack) {
    // 属性记录effect
    dep.add(activeEffect);
    // effect和属性互相关联
    activeEffect.deps.push(dep);
  }
}

// 派发更新
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key: string | symbol,
  newValue: unknown,
  oldValue: unknown,
) {
  const depsMap = targetMap.get(target);

  // 说明触发的值不再模板中使用
  if (!depsMap) return;

  let effects = depsMap.get(key);

  // 永远在执行之前拷贝一份来执行，不要关联引用
  triggerEffects(effects);
}

export function triggerEffects(effects: Set<ReactiveEffect> | undefined) {
  if (effects) {
    effects = new Set(effects);
    effects.forEach((effect: ReactiveEffect) => {
      // 在执行effect的时候，发现【正在执行的】和【待执行的】effect是同一个，那么需要规避，避免无限循环
      if (activeEffect !== effect) {
        if (effect.scheduler) {
          effect.scheduler();
        } else {
          effect.run();
        }
      }
    });
  }
}
