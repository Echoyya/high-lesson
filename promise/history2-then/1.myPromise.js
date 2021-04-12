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
        this.onfulfilledCallbacks.forEach(fn=>fn())
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
        this.onrejectedCallbacks.forEach(fn=>fn())
      }
    }

    try {
      executor(resolve, reject) // 立即执行
    } catch (e) { //  错误处理，抛出异常
      reject(e)
    }
  }
  then(onfulfilled, onrejected) {
    if (this.status === RESOLVED) {
      onfulfilled('my...' + this.value)
    }
    if (this.status === REJECTED) {
      onrejected('my...' + this.reason)
    }
    console.log(this.status);
    if (this.status === PENDING) {
      this.onfulfilledCallbacks.push(()=>{
        onfulfilled('my...' + this.value)
      })
      this.onrejectedCallbacks.push(()=>{
        onrejected('my...' + this.reason)
      })
    }
  }
}

module.exports = PromiseA