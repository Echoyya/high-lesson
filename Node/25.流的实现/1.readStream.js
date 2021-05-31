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
// rs本身是非流动模式，只要监听了data事件后，就变成了流动模式
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


// 文件的可读流 基于 stream模块的 Readable这个类  ReadStream 继承于 Readable

//ReadStream.__proto__ = Readable 继承静态属性和方法
//ReadStream.prototype.__proto__ = Readable.prototype 继承原型方法
//Readable.call(this) 继承实例属性  

// 我们fs.createReadStream()  是有open方法的，但是可读流没有这个方法
// 父类 Readble会提供一个read方法 -> 会调用子类的_read方法 (不同的子类实现的_read不同)

// extends + super

// 1) 内部会先打开文件，并且直接进行读取操作 （默认是暂停模式）
// 2）监控用户是否绑定了data事件 （resume） 开始读取数据 
// 3) fs.read方法 将数据读取到  
// 4）调用push方法 （父类提供的）  
// 5）触发data事件