// Buffer 代表的是内存，内存中一段固定空间，产生的内存固定大小，不能随意添加
// npm install @type/node  可以支持node提示
// Buffer像数组，但和数组有区别，数组可以扩展，Buffer不能，可以用索引取值

const y = Buffer.from('芽') // 可以调用toString 转化成指定的编码
const r = y.toString('base64')
console.log(y); // <Buffer e8 8a bd>
console.log(r); // 6Iq9 
console.log(y[0], y[1], y[2]); //直接取是十进制： 232 138 189
console.log(y[0].toString(2), y[1].toString(2), y[2].toString(2)); // toString转化为二进制


// base64的来源就是将每个字节都转化为 小于64的值
// 11101000 10001010 10111101  3 * 8 => 6 * 4  base64 编码最大能表示的数字是63
// 111010  001000  101010  111101


console.log(parseInt('111010', 2)); // 58
console.log(parseInt('001000', 2)); // 8
console.log(parseInt('101010', 2)); // 42
console.log(parseInt('111101', 2)); // 61

// 0-63的取值范围是 64，二进制表示就是 000000 -111111

let str = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ'
str += str.toLowerCase()
str += '0123456789+/'

let n = str[58] + str[8] + str[42] + str[61]

console.log(n, n === r); // 6Iq9 true


// -------------------------------------------------------
// alloc from slice copy concat isBuffer Buffer.length

// 1.alloc 创建一个指定大小的buffer。
let b1 = Buffer.alloc(5)
console.log('b1:', b1);

// 2.from 从字符串或者数组创建一个buffer
let b2 = Buffer.from([1, 2, 3, 5, 6])
console.log('b2:', b2);

// 3.slice 
let b3 = Buffer.from([1, 2, 3, 5, 6]) // buffer 内部存储的是引用地址，不同于一维数组，相当于二维数组
let sliceB3 = b3.slice(0, 1)
sliceB3[0] = 100
console.log('b3:', b3);

// Array.slice
let arr = [ [1], 2, 3, 4, 5, 6 ] // 二维数组中存的是引用地址，slice是浅拷贝
let newArr = arr.slice(0, 1)
newArr[0][0] = 100
console.log(arr); // [ [ 100 ], 2, 3, 4, 5, 6 ]


// 4.copy 实现 myCopy   可以将buffer的数组拷贝到另一个buffer上， concat是基于copy
let buf0 = Buffer.from('周')
let buf1 = Buffer.from('杰')
let buf2 = Buffer.from('伦')

let bigBuf1 = Buffer.alloc(9)
let bigBuf2 = Buffer.alloc(9)
buf0.copy(bigBuf1, 0)
buf1.copy(bigBuf1, 3)
buf2.copy(bigBuf1, 6) // 默认后两个参数不用传递
console.log(bigBuf1, bigBuf1.toString());

// Buffer.copy(targetBuffer: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number
Buffer.prototype.myCopy = function (targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
  for (let i = sourceStart; i < sourceEnd; i++) {
    targetBuffer[targetStart++] = this[i]
  }
}

buf0.myCopy(bigBuf2, 0)
buf1.myCopy(bigBuf2, 3)
buf2.myCopy(bigBuf2, 6) // 默认后两个参数不用传递
console.log(bigBuf2, bigBuf2.toString());

// concat buffer 拼接
let buf3 = Buffer.from('周')
let buf4 = Buffer.from('杰')
let buf5 = Buffer.from('伦')

// http数据是分包传递的，把每段数据进行拼接
console.log(Buffer.concat([buf3, buf4, buf5], 20));

// Buffer.concat(list: readonly Uint8Array[], totalLength?: number): Buffer
Buffer.myConcat = function (bufList, length = bufList.reduce((a, b) => a + b.length, 0)) {
  let buf = Buffer.alloc(length)
  let offset = 0
  bufList.forEach(item=>{
    item.copy(buf,offset)
    offset+=item.length
  })
  return buf
}
console.log(Buffer.myConcat([buf3, buf4, buf5], 20));

// isBuffer  判断一个数组是否是buffer类型
console.log(Buffer.isBuffer(buf5));

// Buffer.length
let buf6 = Buffer.from('周杰伦')
console.log(buf6.byteLength,buf6.length,'周杰伦'.length);   // 9 9 3 
