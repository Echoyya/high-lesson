/**
 * bind 特点
 *  1. 可以改变当前函数this指向，绑定参数
 *  2. bind 方法返回一个绑定后的函数，高阶函数
 *  3. 如果绑定的函数被new 调用，当前函数的this就是当前的实例
 *  4. new 出来的结果可以找到原有类的原型
 */

let obj = {
  name: 'yya'
}

function fn(name, age) {
  this.say = 'hello'
  this.name = 'ayya'
  console.log(this);
  console.log(this.name + `养了一只${name},${age}岁了`);
}
Function.prototype.mBind = function (context) {
  let that = this
  let bindArgs = Array.prototype.slice.call(arguments, 1) // ['猫']
  function Fn(){}  // Object.create() 原理
  function fBound() {
    let args = Array.prototype.slice.call(arguments)
    return that.apply(this instanceof fBound ? this : context, bindArgs.concat(args))
  }
  // fBound.prototype = this.prototype;   // 方法1 弊端就是两个原型公用
  Fn.prototype = this.prototype;          // 方法2 的好处就是，两个原型并没有公用，而是通过原型链的查找方式
  fBound.prototype = new Fn()
  return fBound
}
fn.prototype.eat = function(){
  console.log('eat');
}
fn.prototype.flag = '哺乳类'

let bindFn = fn.bind(obj, '猫')
let mbindFn = fn.mBind(obj, '猫')
// bindFn(9)
// mbindFn(9)

// new 调用处理
let instance = new bindFn(9)
let mInstance = new mbindFn(9)

// 原型链查找
instance.eat()
mInstance.eat()

console.log(instance.flag);
console.log(mInstance.flag);