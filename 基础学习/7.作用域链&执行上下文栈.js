// 执行上下文栈 Execution Context Stack  (ECS)

function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('c');
}
a()

/**
 * 1. 栈型结构，执行时会让一个全局上下文
 * ECS = [
 * Global:
 * ]
 * 2. ECS.push(functionAContext)
 *    ECS.push(functionBContext)
 *    ECS.push(functionCContext)
 * 
 * 3. 栈执行，首先C函数执行完毕,先进后出，
 *    ECS.pop()   弹出c
 *    ECS.pop()   弹出b
 *    ECS.pop()   弹出a
 * 
 * 全局上下文 只有在浏览器关闭的时候，才会销毁
 * 三个属性：变量对象，作用域链，this指向
 * 
 * 作用域 是在函数定义时决定的，函数会保存一个内部属性，[[Scopes]]  数组，其中保存着所有的父变量对象,并且在函数执行时，将AO 对象加进去
 * 
 * 变量对象VO：是与执行上下文相关的特殊对象,用来存储上下文的函数声明，函数形参和变量。
 * 在global全局上下文中，变量对象也是全局对象自身，在函数上下文中，变量对象被表示为活动对象AO。
 * 
 * 查找的时候。会在当前上下文的变量对象中查找，找不到就向上级查找，一直找到全局变量对象
 * 
 * 多个上下文的变量对象，所构成的链，就叫做作用域链
 * 
 */

function a() {
  function b() {
    function c() {
      console.log('c');
    }
    console.dir(c)
  }
  b()
}

a()