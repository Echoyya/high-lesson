// node 是什么，可以做什么？

// js 组成 (BOM  DOM ES6模块) | ecmascript |  模块特性，api包，文件操作，创建服务
// runtime 可以让js运行在服务器端
// 可以写脚本  中间层  服务端渲染 可是实现前后端分离  实现高性能的web服务

// 先执行宏任务， 因为script 默认就是一个宏任务，之后的执行过程都是先清空微任务在来执行宏任务
// 先执行主栈代码，执行后清空一轮微任务，执行宏任务队列中的第一个，执行完后，会再次清空微任务，清空下一个宏任务


// -----------------------------

console.log(Object.keys(global));
// 'global',
// 'clearInterval',
// 'clearTimeout',
// 'setInterval',
// 'setTimeout',
// 'queueMicrotask',
// 'clearImmediate',
// 'setImmediate'
// Buffer  缓存区
// process 进程

// console.log(global.process);

// 事件轮循   node10以前和浏览器不一样，11之后 表现形式一样
// 现在的版本就是清空一个宏任务，就清空微任务，以前的版本是等待整个队列 执行完在清空微任务
// timers (setTimeout) poll 方的是io操作，如果没有check，会阻塞 等着定时器到达时间，如果有check会在轮循完毕后立即执行


// -----------------------------


// global 隐藏属性
console.dir(global, {
  showHidden: true
})