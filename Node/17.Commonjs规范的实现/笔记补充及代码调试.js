// *  3> node中 使用内置模块 vm,实现字符串代码的执行 不受影响(沙箱环境)    runInThisContext
/**
 * js 实现一个沙箱环境
 * 1. 快照：执行前记录信息，执行后还原信息
 * 2. proxy 实现
 */

// var a = 1   // ReferenceError: a is not defined
global.a = 1   // 正常执行 ，在node中，全局变量是在多个模块下共享的，所以尽量不要通过global来定义属性
new Function('b','console.log(a,b)')('b')

/**
 * 模块1：global.aa = 1   未做导出
 * 模块2：require('./a');console.log(aa)    // 1 ：会将1 打印出来
 */

 let vm = require('vm')
//  var b = 2
 global.b = 2
 vm.runInThisContext('console.log(b)')   
 vm.runInNewContext('console.log(b)')
// global.xxx
// 全局上下文
  // function(exports,module,require,__dirname,__filename){ 上述代码中，相当于将var b =2定义在这里，在其他上下文获取不到}    
  //  vm.runInThisContext  同new Function 相比，不会产生新的函数，可以访问到 global上的全局变量,表示当前的上下文
// runInNewContext 产生一个新的独立的执行上下文， 同时也访问不到 global上的全局变量



// --------------------------------------------------------------------


// 代码调试
let a = require('./a')
console.log(a)

// 创建了launch.json 文件

// 1. 直接在vscode中调试
// 2. 可以在chrome中进行调试
// 3. 可以在命令行中进行调试