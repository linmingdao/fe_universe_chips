import { isFunction } from '@vue/shared';
import { ReactiveEffect, trackEffects, triggerEffects } from './effect';

class ComputedRefImpl {
  public effect;
  public _dirty = true; // 标识取值的时候是否需要重新计算，false就走缓存
  public _value: unknown; // 缓存值的计算结果
  public __v_isReadonly = true;
  public __v_isRef = true;
  public dep = new Set<ReactiveEffect>(); // 关联该计算属性的effect

  constructor(getter: () => any, public setter: Function) {
    this.effect = new ReactiveEffect(getter, () => {
      // 数据修改了，会执行此调度函数
      if (!this._dirty) {
        this._dirty = true;
        // 触发更新
        triggerEffects(this.dep);
      }
    });
  }

  get value() {
    // 依赖收集
    trackEffects(this.dep);

    // 缓存计算值
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }

    return this._value;
  }

  set value(newValue) {
    this.setter(newValue);
  }
}

export const computed = (getterOrOptions: any) => {
  const onlyGetter = isFunction(getterOrOptions);

  let getter;
  let setter;
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => console.warn('no set');
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
};
