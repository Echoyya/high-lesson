// es5 中没有类的概念，使用构造函数 模拟类的实现

// es6 class 语法

// 类的继承：三种属性： 公有属性(__proto__)，私有属性，静态方法(静态属性es7)

// 面试题: 如何实现一个类？

function Parent(name){
  this.name = name // 构造函数中的this，通过new 调用，那么this即指向实例
}
function Son(){
  this.age = 9
  Parent.call(this,'child')
}
Parent.prototype.eat = function(){
  console.log('eaaat ');
}
Son.prototype.smoke = function(){
  console.log('smoking ');
}
let p1 = new Parent()
let s1 = new Son()
// console.log(Parent.prototype.constructor === Parent);

// p1.eat()
// p1.__proto__.eat()

/**
 *  一、继承私有属性  通过在子类中调用 Parent.call(this)，实现继承私有属性
 */
// console.log(s1.name);    // child

/**
 * 二、继承公有属性
 *  1. 修改 __proto__
 *  2. create 方法 
 */

// Error错误用法：会丢失Son原有的属性，并且一方修改，另一个也会被修改
// Son.prototype  = Parent.prototype
// Son.prototype.a = 100  
// console.log(Parent.prototype.a);   // 100 

// 1. 修改 __proto__
Son.prototype.__proto__ = Parent.prototype   // 通常不会轻易去操作 __proto__，可以使用ES6新增 setPrototypeOf方法
Object.setPrototypeOf(Son.prototype,Parent.prototype)  // 方法等同于上
let p2 = new Parent()
let s2 = new Son()
s2.eat()
s2.smoke()
Son.prototype.a = 100 
console.log(Parent.prototype.a);   // undefined

// 2. create 方法 可以实现只继承公有属性,会改变子类原型的 构造器，
// 并且会丢失子类原有原型上的属性和方法，需要在改变原型指向后，在给子类原型上添加方法
Son.prototype = Object.create(Parent.prototype)
console.log(Son.prototype.constructor);    // [Function: Parent]
Son.prototype = Object.create(Parent.prototype,{constructor:{value:Son}})
console.log(Son.prototype.constructor);    // [Function: Son] 
Son.prototype.speak = function(){
  console.log('speaking ');
}
let p3 = new Parent()
let s3 = new Son()

s3.eat()
s3.speak()

// 自己实现 create 原理
function myCreate(parentPrototype,props){
  function Fn(){}
  Fn.prototype = parentPrototype
  let fn  = new Fn()
  for(let key in props){
    Object.defineProperty(fn,key,props[key])
  }
  console.log(Fn.prototype)
  return fn
}
Son.prototype = myCreate(Parent.prototype,{constructor:{value:Son}})

let s4 = new Son()

console.log(s4.__proto__.constructor === s4.constructor);    // true  

/**
 *  三、继承公有属性和私有属性
 */
Son.prototype = new Parent()   //  一般不用
