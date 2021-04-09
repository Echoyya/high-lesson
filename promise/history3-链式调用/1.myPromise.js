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
  // console.log(promise2, x, resolve, reject);
  if(promise2 === x){
    // return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'))
    return reject(new TypeError('循环引用报错'))
  }
}
class PromiseA {
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
      console.log(e, 'inner');
      reject(e)
    }
  }
  // 1. promise 成功和失败的回调的返回值，可以传递给外层的then
  // 2. 如果返回的是 普通值的话（传递到下一次的成功中,不是错误不是promise就是普通值，包括对象），出错的情况(一定会走到下一次的失败)，可能还要promise的情况(会采用promise的状态，决定下一次的成功还是失败)
  // 3. 错误处理，如果离自己最近的then没有错误处理(没有写错误处理) ，会向下找
  // 4. 每次执行完promise.then 方法后返回的都是一个“新的promise”   因为原有的promise状态一旦发生改变，就不能再改变，不符合实现规范
  then(onfulfilled, onrejected) {
    let promise2 = new Promise((resolve, reject) => { // 为了实现链式调用
      if (this.status === RESOLVED) {
        try {
          setTimeout(() => {
            let x = onfulfilled('my...' + this.value)
            // x 可能会是一个promise
            resolvePromise(promise2, x, resolve, reject)
          })
        } catch (e) {
          reject(e)
        }

      }
      if (this.status === REJECTED) {
        try {
          setTimeout(() => {
            let x = onrejected('my...' + this.reason)
            resolvePromise(promise2, x, resolve, reject)
          })
        } catch (e) {
          reject(e)
        }
      }
      if (this.status === PENDING) {
        this.onfulfilledCallbacks.push(() => {
          try {
            setTimeout(() => {
              let x = onfulfilled('my...' + this.value)
              resolvePromise(promise2, x, resolve, reject)
            })
          } catch (e) {
            reject(e)
          }
        })
        this.onrejectedCallbacks.push(() => {
          try {
            setTimeout(() => {
              let x = onrejected('my...' + this.reason)
              resolvePromise(promise2, x, resolve, reject)
            })
          } catch (e) {
            reject(e)
          }
        })
      }
    })
    return promise2
  }
}

module.exports = PromiseA