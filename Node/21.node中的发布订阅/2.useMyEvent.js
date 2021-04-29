
const EventEmitter = require('./myEvents')
const util = require('util')

function Girl(){

}

util.inherits(Girl,EventEmitter);

let g = new Girl()

g.on('女生失恋',(...args)=>{
  console.log('逛街',...args);
})

let shopping = ()=>{
  console.log('购物');
}
g.on('女生失恋',shopping);

let eat = ()=>{
  console.log('吃');
}
g.once('女生失恋',eat)

setTimeout(()=>{
  g.off('女生失恋',eat)
  g.emit('女生失恋',1,2,3)
  g.off('女生失恋',shopping)
  g.emit('女生失恋',1,2,3)
},1000)

// let e = new EventEmitter()
// console.log(g.events);  undefined
// console.log(e.events);  {}