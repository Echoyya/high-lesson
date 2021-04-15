// 原型 prototype  __proto__

const { prototype } = require("../promise/history3-链式调用 copy/1.myPromise");

// 每一个函数 都有一个prototype 属性
// 每一个对象 都有一个 __proto__属性

function Animal(){
  this.type = '哺乳类'
}

Animal.prototype.type = '两栖类....'

let animal = new Animal()

console.log(animal.__proto__ === Animal.prototype);  // true
console.log(animal.type);  //  哺乳类

delete animal.type   // 删掉实例自身属性，会沿原型链 向上查找

console.log(animal.type);  //  两栖类....


console.log(animal.__proto__.__proto__ === Animal.prototype.__proto__);  // true
console.log(animal.__proto__.__proto__ === Object.prototype);            // true
console.log(animal.__proto__.__proto__.__proto__ === null);              // true  顶层对象，原型链的终点

// constructor 构造器指向构造函数
console.log(Animal.constructor);  // 查找的是Animal.__proto__.constructor
console.log(Animal.constructor === Animal.__proto__.constructor)    // true
console.log(Animal.prototype.constructor === Animal)    // true


// 特殊情况  Function Object (可以充当对象，也可以充当函数)
// 同时存在 __proto__  prototype 两个属性
// 并存在以下关系
// Function 是一个比较特殊的存在，在js运行时，就已经存在，强制性的把原型指向了 函数的原型对象
console.log(Function.__proto__ === Function.prototype); // true
console.log(Object.__proto__ === Function.prototype);   // true
console.log(Object.__proto__ === Function.__proto__);   // true

// ------------------------------------------------------------------------------------------

// 判断一个属性时实例属性还是原型上的属性

function Car(){
  // this.type = 'BMW'
}

Car.prototype.type = 'AD'

let car = new Car()

console.log(car.hasOwnProperty('type'));   // true，注释掉构造函数中的this.type = 'BMW',将返回false

console.log('type' in car);   // true

// 二者判断规则
// in 关键字，会判断该属性是否是属于 原型或者实例上的属性
// hasOwnProperty 只会看是否存在于当前的实例上 