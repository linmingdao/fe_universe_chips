let { port1, port2 } = new MessageChannel();
let activeFrameTime = 1000 / 60; // 16.6
let frameDeadline; // 这一帧的截止时间
let penddingCallback;

// 获取每一帧的剩余时间
let timeRemaining = function () {
  return frameDeadline - performance.now();
};

port2.onmessage = function () {
  let currentTime = performance.now();
  // 是否超时，帧的截止时间小于当前时间，说明超时了
  let didTimeout = frameDeadline <= currentTime;

  if (didTimeout || timeRemaining() > 0) {
    if (penddingCallback) {
      penddingCallback({ didTimeout, timeRemaining });
    }
  }
};

window.requestIdleCallback = function (callback, options) {
  requestAnimationFrame(function (rafTime) {
    console.log(rafTime);
    // 每一帧的开始时间 + 每一帧的执行时间16.6 = 一帧的截止时间
    frameDeadline = rafTime + activeFrameTime;
    penddingCallback = callback;
    // 其实发消息之后，相当于添加一个宏任务
    port1.postMessage('hello');
  });
};
