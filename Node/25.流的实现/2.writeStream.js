const fs = require('fs')

// 并发异步操作，如果同一时刻，多个线程 操作一个文件，可能会有问题，除了第一次的write，其余都存进缓存区，第一个完成后，清空缓存区，如果缓存区过大，也会导致内存的浪费，所以会设置一个预期的值，来进行控制，

// 可以把并发操作，改为串行异步，
const rss = fs.createReadStream('./a.txt',{
  highWaterMark:3   // 读取默认是64k
})

const wss = fs.createWriteStream('./b.txt',{
  highWaterMark:2   // 写入默认是16k
})

// 文件读取写入 第一次是真的往文件中，写入，后续的操作都是读写内存，而我们要注意的是，尽量避免操作内存
rss.on('data',function(chunk){
  let flags = wss.write(chunk)
  if(!flags){
    console.log('写不下了');
    rss.pause()
  }
})

// drain 过后，write 是往文件中写
wss.on('drain',function(){   // 目前所有写入的数据都完毕了
  console.log('写完了');
  rss.resume()
})