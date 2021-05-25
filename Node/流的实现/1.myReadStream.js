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
    this.open(); // 打开文件 ，注意：这个方法是异步的

    // 用户监听了 data 事件时，才去执行 read方法
    this.on('newListener',function(type){
      if(type === 'data'){
        this.read()
      }
    })
  }
  destroy(err) {
    this.emit("error", err)
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
    const buf = Buffer.alloc(this.highWaterMark)
    // 读取文件中的内容，每次读取this.highWaterMark 个
    fs.read(this.fd,buf,0,this.highWaterMark,this.offset,(err,bytesRead,buffer)=>{   // bytesRead:读取的字节数  buffer:缓冲区对象
      if(bytesRead){  
        // console.log(bytesRead,buffer,buffer.toString());
        this.offset += bytesRead
        this.emit('data',buf.slice(0,bytesRead))
        this.read()
      }else{
        this.emit('end')
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

}
module.exports = ReadStream