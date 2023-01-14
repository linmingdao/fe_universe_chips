const channel = new MessageChannel();
const { port1, port2 } = channel;

// 用DOM2级事件处理
// port1.addEventListener("message", (evt) => {
//   console.log("port1 receive message:", evt.data);
// });
// port2.addEventListener("message", (evt) => {
//   console.log("port2 receive message:", evt.data);
// });
// port1.start();
// port2.start();

// 使用DOM0级事件处理，会隐式调用start()方法
port1.onmessage = (evt) => {
  // 接收来自 port2 发来的消息
  console.log("port1 receive message:", evt.data);
};
port2.onmessage = (evt) => {
  // 接收来自 port1 发来的消息
  console.log("port2 receive message:", evt.data);
};

port1.postMessage("message form port1");
port2.postMessage("message form port2");

// port2 receive message: message form port1
// port1 receive message: message form port2
