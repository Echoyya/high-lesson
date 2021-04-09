// 使用fs 模块，读取文件内容，是什么格式？

// 读到的内容为字符串格式，


const fs = require('fs')
const path = require('path')

let con = fs.readFileSync(path.resolve(__dirname, 'a.js'), 'utf8')

// console.log(con);  //  字符串

// 需求：怎么能让字符串执行。并且包着一层function()

// 1>  eval   可能会导致模块之间的相互引用 影响作用域

// let a = 1
// let b = 2222
// eval(con)
// eval('console.log(a)')

// 2> new Function  模板引擎，会采用newfunction 的形式

// let c = 'console.log(11111111)'
// let fn = new Function(c)
// // console.log(fn.toString());
// console.log(fn());

// 3> node中 使用内置模块 vm,实现字符串代码的执行  
/**
 * runInThisContext: 运行在当前的上下文环境中，会单独创建一个沙箱环境，拿不到外面的变量和结果
 */

let vm = require('vm')
let d = 4444
vm.runInThisContext('console.log(34323232)')
// console.log();

// 模块化的作用  解决命名冲突，方便维护，给当前内容增加一个函数
let aa = require('./a')   // 默认会自动添加hs后缀，.json  .node

// 执行过程
/**
 * 1. 先将./a 的文件转化为绝对路径
 * 2. 读取这个文件，需要增加一个函数，函数内部需要module.exports 导出模块
 * 3. 让函数执行
 */

// 1. 可以在浏览器中调试  node --inspect-brk  .\useA.js   浏览器中  chrome://inspect
