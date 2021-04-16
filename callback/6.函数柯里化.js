// 函数柯里化，多个参数的传入，转为n个函数，可以暂存变量，

// 一般柯里化参数要求，都是一个一个传，传多个时，通常叫做偏函数

// 判断一个变量的类型， 代码实现，类型是基本条件

// typeof 用于判断基础类型
// instanceof  用于判断 xxx 是否是 yyy实例，原理，查找原型链
// Object.prototype.toString.call  判断具体类型，返回一个字符串
// coustrutor 深拷贝


// 类型判断
function isTypeOne(type, content) {
  let t = Object.prototype.toString.call(content).replace(/\[object\s|\]/g, '') // [object String]
  return t === type
}


function isTypeTwo(type, content) {
  return Object.prototype.toString.call(content) == `[object ${type}]`
}

console.log(isTypeOne('String', 'abc')); // true
console.log(isTypeTwo('Number', 123)); // true


//  柯里化，让函数变得更具体一些， 反柯里化，让函数范围变得更大一些
// 实现通用的柯里化，高阶函数


// ??
function curry(fn, ...rest) {
  const lg = fn.length
  return lg <= rest.length ? fn(...rest) : (...rest2) => curry(fn, ...rest, ...rest2)
}


function currying(fn) {
  // 存储每次调用时传入的参数
  const inner = (args = []) => {
    return args.length >= fn.length ? fn(...args) : (...userArgs) => inner([...args, ...userArgs]) // 递归返回函数
  }
  return inner()
}

function isTypeThree(type, content) {
  return Object.prototype.toString.call(content) == `[object ${type}]`
}

let util = {}
let arr = ['String', 'Number', 'Array', 'Object', 'Null', 'Date', 'RegExp'].forEach(type => {
  util['is' + type] = currying(isTypeThree)(type)
})

console.log(util.isString('kjhalkslah'));

// ----------------------------------------------------------------------------------------

function sum(a, b, c, d) { // 要记录每次调用时传入的参数，并且和函数的参数个数进行比较，如果不满足总个数，就返回一个新函数，如果传入的个数与参数一致，执行原来的函数
  return a + b + c + d
}
// 实现通用的柯里化,  主要注意的是，被调方法 参数个数固定，并且执行时，参数一个一个传，原来的函数，执行结束后，在传参调用会报错
let sum1 = currying(sum)
let sum2 = sum1(1)
let sum3 = sum2(2, 3)
let result = sum3(4, 1, 12)
console.log(result);