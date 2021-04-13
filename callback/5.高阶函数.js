// 函数可以返回函数

// 类型判断
function isType(type, content) {
  // [object String]
  let t = Object.prototype.toString.call(content).replace(/\[object\s|\]/g, '')
  return t === type
}

// console.log(isType('String','a'));


// 高阶函数 
function highIsType(type) {
  return function (content) {
    let t = Object.prototype.toString.call(content).replace(/\[object\s|\]/g, '')  // [object String]
    return t === type
  }
}
// 需要批量产生一些方法 isString('a')   isNumber(123)
let arr = ['String', 'Number', 'Array', 'Object', 'Null', 'Date', 'RegExp']
let util = {}
arr.forEach(item => {
  util['is' + item] = highIsType(item)
})

// let isString = highIsType('String')
// console.log(isString('a'));

console.log(util);
console.log(util.isRegExp(/\[\]/g));