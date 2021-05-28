const fs = require('fs')

// fs.open  fs.write  fs.close

let ws = fs.createWriteStream('./b.txt',{
  flags:'w',
  encoding:'utf8',
  autoClose:true,
  start:0,
  highWaterMark:3  // 与可读流不一样，这里表示期望使用多少内存来写，默认是16*1024 个字节 
})
ws.on('open',function(wfd){
  console.log('open',wfd);
})
ws.on('close',function(){
  console.log('close',);
})

// 写入时对数据格式有要求，只能是string or buffer ，该方法是fs.write，异步的
// let flags = ws.write('1',function(){
//   console.log('write');
// })
// flags:在写入时，会累计写入的字节数，如果超出预期或等于预期则返回false，虽然超过了预期，但是不影响写入
let flags = ws.write('1')
console.log(flags);   
flags = ws.write('1')
console.log(flags);   
flags = ws.write('1')
console.log(flags);   
flags = ws.write('1')
console.log(flags);   
flags = ws.write('1')
console.log(flags);   
flags = ws.write('1')
console.log(flags);   
ws.end()   // write + close,触发close 方法。必须要显示的调用end方法，并且autoClose:true,


// 并发异步操作，如果同一时刻，多个线程 操作一个文件，可能会有问题，除了第一次的write，其余都存进缓存区，第一个完成后，清空缓存区，如果缓存区过大，也会导致内存的浪费，所以会设置一个预期的值，来进行控制，


