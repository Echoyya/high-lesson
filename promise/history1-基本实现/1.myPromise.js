// 1. promise 就是一个类
// 2. promise 有三种状态，成功，失败，等待
// 3. promise 默认执行器 立即执行
// 4. 用户可自定义成功失败的原因
// 5. promise 实例拥有一个then方法。一个参数是成功的回调，一个是失败的回调
// 6. 如果执行函数时，发生异常也会执行失败的逻辑
// 7. promise 状态一旦发生改变，就不能在改变


const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
const PENDING = 'PENDING'
class PromiseA {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    let resolve = (value) => {
      if (this.status === PENDING) {
        this.value = value
        this.status = RESOLVED
      }
    }
    let reject = (reason) => {
      if (this.status === PENDING) {
        this.reason = reason
        this.status = REJECTED
      }
    }

    try {
      executor(resolve, reject) // 立即执行
    } catch(e) { //  错误处理，抛出异常
      reject(e)
    }
  }
  then(onfulfilled, onrejected) {
    if(this.status ===RESOLVED){
      onfulfilled('my...'+this.value)
    }
    if(this.status ===REJECTED){
      onrejected('my...'+this.reason)
    }
  }
}

module.exports = PromiseA