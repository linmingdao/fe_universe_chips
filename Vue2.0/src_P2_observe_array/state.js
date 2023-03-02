import { observe } from './observe/index.js';

export function initState(vm) {
  const options = vm.$options;

  // props、data、methods、watch、computed
  if (options.data) {
    initData(vm);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  // 如果是函数则拿到函数的返回值，否则直接采用data作为数据源
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  // 属性劫持，采用defineProperty将所有的属性进行劫持
  observe(data);
}
