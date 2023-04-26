import { isFunction } from '@vue/shared';
import { ReactiveEffect } from './effect';

class ComputedRefImpl {
  public effect;
  public _dirty = true; // 标识取值的时候是否需要重新计算，false就走缓存
  public _value: unknown; // 缓存值的计算结果
  public __v_isReadonly = true;
  public __v_isRef = true;

  constructor(getter: () => any, public setter: Function) {
    this.effect = new ReactiveEffect(getter, () => {
      // 数据修改了，会执行此调度函数
      debugger;
    });
  }

  get value() {
    if (this._dirty) {
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
