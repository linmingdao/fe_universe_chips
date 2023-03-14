let callbacks = [];
let waiting = false;

function flushCallback() {
  callbacks.forEach((cb) => cb());
  callbacks = [];
  waiting = false;
}

export function nextTick(cb) {
  callbacks.push(cb);

  // 多次调用nextTick，如果没有刷新就把cb放到数组里，到时批量执行
  if (waiting === false) {
    setTimeout(flushCallback, 0);
    waiting = true;
  }
}
