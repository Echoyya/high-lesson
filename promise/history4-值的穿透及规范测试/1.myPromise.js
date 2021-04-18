// 1. promise 就是一个类
// 2. promise 有三种状态，成功，失败，等待
// 3. promise 默认执行器 立即执行
// 4. 用户可自定义成功失败的原因
// 5. promise 实例拥有一个then方法。一个参数是成功的回调，一个是失败的回调
// 6. 如果执行函数时，发生异常也会执行失败的逻辑
// 7. promise 状态一旦发生改变，就不能在改变

// 8. 当promise是异步代码时(定时器执行resolve),此时then方法中状态仍然是pending，

const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
const PENDING = 'PENDING'
const resolvePromise = (promise2, x, resolve, reject) => {
  // 判断x是不是promise
  // 规范里规定了一段代码，这个代码可以实现自己编写的promise和别人的promise可以进行交互
  if (promise2 === x) { // 不能自己等待自己完成
    // return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'))
    return reject(new TypeError('循环引用报错'))
  }
  // x 不是null 或者是对象  || 函数
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    // Object.defineProperty(x,'then',{
    //   get(){
    //     ++index == 2 && throw new Error() 
    //   }
    // })
    let called; // 为了保证其他promise 库符合a+规范
    try { // 为防止then时 出现异常，Object.defineProperty
      let then = x.then // 取x 的then 方法 {then:{}}
      if (typeof then === 'function') { // 如果then 是一个函数， 就认为是一个promise，并调用then方法,
        // 为啥不用x.then.call?  因为这个写会触发 getter可能会发生异常
        // call第一个参数是this,后面的是成功回调 和 失败回调
        then.call(x, y => { // 如果y是promise,就继续递归解析promise
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, e => { // 只要失败了就失败了
          if (called) return
          called = true
          reject(e)
        })
      } else { // then 是一个普通对象，就直接成功即可
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else { // x 为普通值
    resolve(x)
  }
}
class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onfulfilledCallbacks = []
    this.onrejectedCallbacks = []
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = RESOLVED
        this.onfulfilledCallbacks.forEach(fn => fn())
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onrejectedCallbacks.forEach(fn => fn())
      }
    }

    try {
      executor(resolve, reject) // 立即执行
    } catch (e) { //  错误处理，抛出异常
      reject(e)
    }
  }
  // 1. promise 成功和失败的回调的返回值，可以传递给外层的then
  // 2. 如果返回的是 普通值的话（传递到下一次的成功中,不是错误不是promise就是普通值，包括对象），出错的情况(一定会走到下一次的失败)，可能还要promise的情况(会采用promise的状态，决定下一次的成功还是失败)
  // 3. 错误处理，如果离自己最近的then没有错误处理(没有写错误处理) ，会向下找
  // 4. 每次执行完promise.then 方法后返回的都是一个“新的promise”   因为原有的promise状态一旦发生改变，就不能再改变，不符合实现规范
  then(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v;
    onrejected = typeof onrejected === 'function' ? onrejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => { // 为了实现链式调用
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            let x = onfulfilled(this.value)
            // x 可能会是一个promise
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onrejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.status === PENDING) {
        this.onfulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onfulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e)
            }
          })
        })
        this.onrejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onrejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
                reject(e)
            }
          })
        })
      }
    })
    return promise2
  }
}

// 测试自己的写的promise 是否符合a+规范
// promise的延迟对象
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject
  })
  return dfd;
}

// npm install promises-aplus-tests -g
// promises-aplus-tests ./1.myPromise.js
module.exports = Promise