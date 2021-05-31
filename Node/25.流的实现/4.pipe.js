const fs = require('fs')

const rs = fs.createReadStream('./a.txt',{highWaterMark:4})

const ws = fs.createWriteStream('./c.txt',{highWaterMark:1})

rs.on('data',function (data) { 
  let flag = ws.write(data)
  // if(!flag){
  //   rs.pause()
  // }
})

ws.on('drain',function () {
  // console.log('xxx');
  // rs.resume()
})


// -----------------------------------------------------

const ReadStream = require('./1.myReadStream')
const WriteStream = require('./2.myWriteStream')

const rss = new ReadStream('./a.txt',{highWaterMark:4})

const wss = new WriteStream('./c.txt',{highWaterMark:1})

rss.pipe(wss)     // 该方法是异步的，因为底层还是使用的fs.read fs.open fs.write等方法
/**
 * 优点：实现简单，一行代码搞定 (对on('data') write() end() close() 方法进行了封装)
 * 缺陷：无法看到具体的过程，或者数据的加工
 * pipe的目的是可以实现读取一点写入一点，监听可读流的触发事件，将获取到的数据写入到可写流中，如果返回false，则暂停读取
 * 读取完毕后触发drain事件，再继续读取，知道最终完毕，用户无法对读取到的数据进行操作，如果需要操作读取到的数据 ，需要使用on('data')形式
 * 
 */
