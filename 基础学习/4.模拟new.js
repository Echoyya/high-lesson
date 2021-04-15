function Animal(type) {
  this.type = type
}

function Car(type) {
  this.type = type
  // 如果当前构造函数 返回的是一个引用类型或函数，需要把这个对象返回
  return {
    type: 'BMW'
  }
}

Animal.prototype.say = function () {
  console.log('say');
}

let an = new Animal('哺乳类')
an.say()


function mockNew() {
  // Constructor => animal 剩余的arguments 就是其他参数
  let Constructor = [].shift.call(arguments) // Array.prototype.shift.call(arguments)
  let obj = {} // 返回的结果
  // let obj = Object.create(null)    // 不可用, 产生一个空对象，没有原型链
  obj.__proto__ = Constructor.prototype // 继承原型上的方法
  let r = Constructor.apply(obj, arguments)
  return r instanceof Object ? r : obj
}


let mAn = mockNew(Animal, '哺乳类') // 第一个参数是 类，第二个为给类传的参数
let mCar = mockNew(Car,'LBJN')
console.log(mCar);