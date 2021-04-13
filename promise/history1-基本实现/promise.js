// 自己实现封装promise
// let Promise = require('./1.myPromise')

let promise = new Promise((resolve, reject) => {
  // throw new Error('失败了')
  // reject('失败')
  resolve('成功')
})

promise.then((data) => {
  console.log(data)
}, (err) => {
  console.log(err)
})

// promise es6 内部实现，IE不支持。需要使用polyfill 兼容
// 解决异步回调问题

// promise 是一种异步流程的控制手段
// 1. 回调地狱 ，代码难以维护，第一个的输出是第二个的输入
// 2. promise可以支持多个异步请求并发，（希望同步最终的结果）获取并发请求中的数据
// 3. promise 可以解决异步的问题，但是本身并不能说peomise 是异步的，但promise.then是异步的
// 4. promise 链式调用: 实现链式回调，返回的并不是this，而是一个新的promise 

// 5. promise resolve 成功，reject失败 pending 等待
// 如果一旦promise成功了就不能失败，反之同理，只有状态是等待时，才可以转化状态
// 每个promise实例上都有一个then方法，then方法中有两个参数，一个参数是成功回调，一个参数是失败回调，

// 6 . promise本身只有一个参数   executor 执行器，默认new时 会立即调用
// new Promise(executor: any )  默认executor是同步执行 ，then方法是异步的

let pp = new Promise((resolve, reject) => {
  console.log(1);
  resolve('成功')
})
console.log(2); //  打印顺序  1,2

// 7 .一个promise 可以then 多次

pp.then((data) => {
  console.log(data)
})
pp.then((data) => {
  console.log(data)
})
pp.then((data) => {
  console.log(data)
})
// 成功  成功  成功
// -----------------------------------------------------------

pp.then((data) => {
  console.log(data)
}).then((data) => {
  console.log(data)
}).then((data) => {
  console.log(data)
})
// 成功  undefined  undefined
// -----------------------------------------------------------

let p1 = new Promise((s, j) => {
  setTimeout(() => {
    s(1)
  }, 3000)
})
let p2 = new Promise((s, j) => {
  setTimeout(() => {
    s(2)
  }, 2000)
})
let p3 = new Promise((s, j) => {
  s(3)
})

// 8. Promise.all() 并发，将多个 Promise 实例，包装成一个新的 Promise 实例。
//      （1）p1、p2、p3全成功，p才会fulfilled，p1、p2、p3的返回值组成一个数组，传递给p的回调函数。按顺序返回，并不按照执行时间
//      （2）p1、p2、p3有一个rejected，p的就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

Promise.all([p1, p2, p3]).then(([r1,r2,r3]) => {
  console.log(r1,r2,r3);
}, err => {
  console.log(err);
});

// 9. Promise.race() 赛跑 将多个 Promise 实例，包装成一个新的 Promise 实例
// 只要p1、p2、p3之中有一个实例 率先 改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。
Promise.race([p1, p2, p3]).then(data => {
  console.log(data);
}, err => {
  console.log(err);
});