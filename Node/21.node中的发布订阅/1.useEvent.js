
const EventEmitter = require('events')
const util = require('util')

function Girl(){

}

util.inherits(Girl,EventEmitter)   // 原型继承，需要通过实例在条用继承的方法，等价于 setPrototypeOf

let g = new Girl()

g.on('女生失恋',()=>{
  console.log('逛街');
})
g.on('女生失恋',()=>{
  console.log('购物');
})

setTimeout(()=>{
  g.emit('女生失恋')
},1000)

// 发布订阅模式 redux vue express koa webpack
// 订阅一次   once
// 订阅方法   on 
// 发布方法   emit 
// 取消订阅   off

// 继承分为：继承实例属性 和 继承原型属性

// Girl.prototype.__proto__ = EventEmitter.prototype   // 第一种

// Object.setPrototypeOf(Girl.prototype,EventEmitter.prototype)  // 第二种

// es6 extends // 第三种

// Girl.prototype = Object.create(EventEmitter.prototype) // 第四种

/*
Girl.prototype = create(EventEmitter.prototype) // 自己实现 create 方法

function create(proto){
  function Fn(){}
  Fn.prototype = proto
  return new Fn()
}
*/

