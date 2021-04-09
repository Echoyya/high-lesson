// 什么是高阶函数
// 一个函数的参数是一个函数，回到函数就是一种高阶函数
// 一个函数返回一个函数，当前这个函数也是一个高阶函数

// 写一个业务代码，扩展当前的业务代码

function say(a,b) {
  console.log('sssay',a,b);
}

Function.prototype.before = function (callback) {
  return (...args)=>{
    callback && callback()
    this(...args)
  }
}

let beforeSay = say.before(function(){
  console.log('before');
})

beforeSay('hello','world')