// 流的分类 1） 可读流  2） 可写流  3) 双工流  4） 转化流

const { Writable, Duplex, Transform } = require('stream');
// class xxx extends Readalbe   read ->  _read()
// 在自己实现的 可读流中，实际是调用了 父类的read方法，在父类的read方法方法中，有调用了子类的_read方法

class MyWrite extends Writable { // writeable 父类write -> 子类_write   可写流同理
  _write(chunk, encoding, cb) {
      console.log(chunk);
      cb(); //  cb 相当于 clearBuffer的作用;    
  }
}
let myWs = new MyWrite();

myWs.write('hello'); // 真正的调用_write
myWs.write('hello'); // 缓存里去了
myWs.write('ok');


// 3) 双工流，继承一个类，可以满足读写的功能
class MyDuplex extends Duplex{
  _read(){}
  _write(){}
}


// 4） 转化流  典型用法 压缩 转码
// 把输入 转化成大写在输出

process.stdin.on('data',function (chunk) {    // 监听用户输入，标准输入，属于可读流(on data)
    process.stdout.write(chunk)  // 标准输出，属于可写流 
})

// 在对输入的过程 进行一个转化操作，将输入的值，转换成大写的


class MyTransform extends Transform{
  _transform(chunk, encoding, cb){    // 参数和 读写流一致
    chunk = chunk.toString().toUpperCase()
    this.push(chunk)    // 相当于 this.emit('data')
    console.log(this);
    cb()
  }
}
let transform = new MyTransform()
process.stdin.pipe(transform).pipe(process.stdout);

