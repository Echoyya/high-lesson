const EventEmitter = require("events");
var fs = require("fs");

class ReadStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || 'r';
    this.encoding = options.encoding || null;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.end = options.end;
    this.highWaterMark = options.highWaterMark || 64 * 1024;
    this.offset = this.start
    this.flowing = false   // 默认非流动状态的，pause resume
    this.open(); // 打开文件 ，注意：这个方法是异步的

    // 用户监听了 data 事件时，才去执行 read方法
    this.on('newListener',function(type){
      if(type === 'data'){
        this.flowing = true
        this.read()
      }
    })
  }
  destroy(err) {
    if(err){
      this.emit("error", err)
    }
    if(this.autoClose){
      fs.close(this.fd,()=>{
        this.emit('close')
      })
    }
  }
  read() {
    if(typeof this.fd !== 'number'){
      return this.once('open',()=>this.read())
    }
    /**
     * fs.read() 参数描述
     *  fd:通过 fs.open() 方法返回的文件描述符。
        buffer:数据写入的缓冲区;
        offset:缓冲区写入的写入偏移量;
        length:要从文件中读取的字节数;
        position:文件读取的起始位置;
        callback:(err,bytes,buffer);bytes:读取的字节数,buffer 为缓冲区对象;
     */
    // 读取文件中的内容，每次读取this.highWaterMark 个
    // 用户传了end 表示可能并不是完全读取，可能只读取一部分，因此每次偏移后与highWaterMark比较，取较小的值
    let howMuchToRead = this.end ? Math.min(this.end - this.offset + 1 ,this.highWaterMark) : this.highWaterMark
    const buf = Buffer.alloc(howMuchToRead)
    fs.read(this.fd,buf,0,howMuchToRead,this.offset,(err,bytesRead,buffer)=>{   // bytesRead:读取的字节数  buffer:缓冲区对象
      if(bytesRead){  
        // console.log(bytesRead,buffer,buffer.toString());
        this.offset += bytesRead
        // this.emit('data',buf)  // 在用户传了end 的时候，可以不用截取，
        this.emit('data',buf.slice(0,bytesRead))  // 但是在用户没有传递end值时，需要截取 buf长度，避免浪费内存
        this.flowing && this.read()     // this.flowing 用于判断是个递归读取
      }else{
        this.emit('end')
        this.destroy()
      }
    })
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        return this.destroy(err)
      }
      this.fd = fd; //保存在实例上 用于后面的读取操作
      this.emit('open', fd);
    })
  }
  pause(){    // 暂停
    this.flowing = false
    
  }
  resume(){
    if(!this.flowing){
      this.flowing = true
      this.read()
    }
  }
}
module.exports = ReadStream