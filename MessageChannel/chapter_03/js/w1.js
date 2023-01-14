self.addEventListener("message", (e) => {
  const port1 = e.ports[0];
  //向另一个端口发送信息
  port1.postMessage("来自w1的信息");
  port1.onmessage = (e) => {
    console.log(e.data);
  };
});
