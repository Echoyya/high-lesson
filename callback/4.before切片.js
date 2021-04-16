// 什么是高阶函数
// 一个函数的参数是一个函数，回到函数就是一种高阶函数
// 一个函数返回一个函数，当前这个函数也是一个高阶函数

// 写一个业务代码，扩展当前的业务代码,但是不能更改核心代码

function say(a,b) {
  console.log('sssay',a,b);
}

Function.prototype.before = function (callback) {
  return (...args)=>{  // 剩余运算符 ，可以把多个参数 转化为数组
    callback && callback()
    this(...args)   // 扩展运算符，
  }
}
// 扩展运算符/剩余运算符，虽然写法是一样的，但是在函数参数里叫剩余，方法执行时传参叫扩展 
let beforeSay = say.before(function(){
  console.log('before');
})

beforeSay('hello','world')


// 闭包？
// 函数的定义是有作用域的概念的，一个函数定义的作用域和执行的作用域不在同一个，肯定会出现闭包