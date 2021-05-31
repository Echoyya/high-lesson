const EventEmitter = require('events')
const fs = require('fs')
const Queue = require('./queue')
class WriteStream extends EventEmitter {
  constructor(path, options) {
    super()
    this.path = path;
    this.flags = options.flags || 'w';
    this.encoding = options.encoding || 'utf8';
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.highWaterMark = options.highWaterMark || 16 * 1024;

    this.needDrain = false // 是否触发drain 方法
    this.len = 0 // 用于维持有多少数据 没有被写入到文件中
    // this.cache = []       // 用于存放缓存数据，队列
    this.cache = new Queue() // 使用数组存放 会产生性能问题，采用链表 模拟队列
    this.writing = false // 是否正在写入,用于标识是否是第一次写入
    this.offset = this.start   // 偏移量
    this.open()
  }
  open() { // 异步方法
    fs.open(this.path, this.flags, this.mode, (err, fd) => {
      this.fd = fd
      this.emit('open', fd)
    })
  }
  clearbuffer(){
    let data = this.cache.poll()
    if(data){
      this._write(data.chunk,data.encoding,data.cb)
    }else{
      this.writing = false
      if(this.needDrain){
        // this.needDrain = false
        this.emit('drain')
      }
    }
  }
  _write(chunk, encoding, cb){
    if(typeof this.fd !== 'number'){
      return this.once('open',()=>{
        this._write(chunk, encoding, cb)
      })
    }
    fs.write(this.fd,chunk,0,chunk.length,this.offset,(err,written)=>{
      this.offset += written  // 维护偏移量
      this.len -= written     // 维护缓存的个数，减少处理
      cb() // 写入成功
    })
  }
  write(chunk, encoding = this.encoding, cb = () => {}) {
    // 需要保证该文件 已经打开，
    // 1. 将数据全部转化为buffer
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    this.len += chunk.length
    let returnValue = this.len < this.highWaterMark // flag
    this.needDrain = !returnValue // !flag

    // AOP 切片编程
    let userCb = cb
    cb = ()=>{
      userCb()
      this.clearbuffer()    // 清空缓存逻辑
    }
    /**
     * 由于ws.write 是同步调用，会导致并发写入问题，所以引入缓存机制(多个并发 ，变成串行)
     * 判断是否是第一次写入 ，原因是第一次写入是真是往文件中写入，以后都是存储到缓存中
     * 当前没有写入，表明是第一次写，需要执行写入的操作
     * 否则存到缓存当中。
     */
    if (!this.writing) {
      this.writing = true
      // console.log('真正写入');
      this._write(chunk, encoding, cb)
    } else {
      // console.log('保存至缓存区');
      this.cache.offer({
        chunk,
        encoding,
        cb
      })
    }
    return returnValue
  }
}
module.exports = WriteStream