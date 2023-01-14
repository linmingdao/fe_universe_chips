self.addEventListener("message", (e) => {
  const port2 = e.ports[0];
  //向另一个端口发送信息
  port2.postMessage("来自w2的信息");
  port2.onmessage = (e) => {
    console.log(e.data);
  };
});
