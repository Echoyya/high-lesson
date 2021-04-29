function EventEmitter() {
  this._events = {}
}

// 订阅方法
EventEmitter.prototype.on = function (eventName, callback) {
  if (!this._events) this._events = {}
  if (this._events[eventName]) this._events[eventName].push(callback)
  else this._events[eventName] = [callback]
}

// 发布方法   
EventEmitter.prototype.emit = function (eventName, ...args) {
  if (this._events && this._events[eventName]) {
    this._events[eventName].forEach(fn => {
      fn(...args)
    });
  }
}

// 取消订阅   
EventEmitter.prototype.off = function (eventName, callback) {
  if (this._events && this._events[eventName]) {
    // 如果存储的方法和传入的不一样就留下，否则就删除
    this._events[eventName] = this._events[eventName].filter(fn => fn != callback && fn.l !== callback)
  }
}

// 订阅一次
EventEmitter.prototype.once = function (eventName, callback) {
  const one = ()=>{  // 绑定执行完移除
    callback()   // 切片编程 ，目的就是增加一些自己的逻辑
    this.off(eventName,one)
  }
  one.l = callback
  this.on(eventName,one)
}


module.exports = EventEmitter