var ReadStream = require("./1.myReadStream");
// const fs = require("fs");

// let rs = fs.createReadStream('./a.txt', {
let rs = new ReadStream('a.txt', {
  flags: "r",        // r代表读取
  encoding: null,    // 默认buffer
  mode: 0o666,       // 可读可写
  autoClose: true,   // 读取完毕后关闭
  start: 1,          // 从第几位读取 包前又包后
  end: 4,            // 读取到第几位,不传表示读到末尾,包尾,如0-1 长度算2
  highWaterMark: 3   // 每次读取的个数
})

rs.on("open", (fd) => {
  console.log('open',fd);       // fd typeof number 表示返回的长度
})

// 会监听用户绑定了 data事件，就会触发响应的回调  不停的触发
// rs本身是非流动模式，只要监听了data事件后，就变成了了流动模式
rs.on("data", (chunk) => {
  console.log('chunk',chunk.toString());
  rs.pause()     // 读完一次 暂停，不在触发data事件
});

// 当文件读取完毕胡触发end事件
rs.on('end', () => {
  console.log('end');
})

rs.on('close', () => {
  console.log('close');
})

rs.on("error", (err) => {
  console.log(err)
})

// 过了1s 在恢复，再次执行data事件
setInterval(()=>{
  rs.resume()
},1000)