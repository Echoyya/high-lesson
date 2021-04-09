

// promise es6 内部实现，IE不支持。需要使用polyfill 兼容
// 解决异步回调问题
// 多个异步请求并发，希望同步最终的结果

// 链式调用

let Promise = require('./1.myPromise')

let promise = new Promise((resolve,reject)=>{
  // throw new Error('失败了')
  resolve('成功')
  // reject('失败')
})

promise.then((data)=>{
  console.log(data)
},(err)=>{
  console.log(err)
})