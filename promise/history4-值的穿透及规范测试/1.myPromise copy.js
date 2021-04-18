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
      executor(resolve, reject)  
    } catch (e) {  
      reject(e)
    }
  }
  then(onfulfilled, onrejected) {
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v;
    onrejected = typeof onrejected === 'function' ? onrejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {  
      if (this.status === RESOLVED) {
        try {
          setTimeout(() => {
            let x = onfulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          })
        } catch (e) {
          reject(e)
        }
      }
      if (this.status === REJECTED) {
        try {
          setTimeout(() => {
            let x = onrejected(this.reason)
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
              let x = onfulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            })
          } catch (e) {
            reject(e)
          }
        })
        this.onrejectedCallbacks.push(() => {
          try {
            setTimeout(() => {
              let x = onrejected(this.reason)
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

const resolvePromise = (promise2, x, resolve, reject) => {
  if (promise2 === x) {  
    return reject(new Error('循环引用报错'))
  }
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
   
    let called;  
    try {  
      let then = x.then  
      if (typeof then === 'function') { 
        then.call(x, y => { 
          if(called) return 
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, e => { 
          if(called) return 
          called = true
          reject(e)
        })
      } else {  
        resolve(x)
      }
    } catch (e) {
      if(called) return 
      called = true
      reject(e)
    }
  } else {  
    resolve(x)
  }
}
Promise.defer = Promise.deferred = function(){
  let dfd = {}
  dfd.promise = new Promise((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject
  })
  return dfd;
}

// npm install promises-aplus-tests -g
// promises-aplus-tests ./1.myPromise.js
module.exports = Promise