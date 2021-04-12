/**
 *  1)platform  window =>win32 mac =>darwin  判断用户的系统
 *  2)nextTick 用来代替promise ，是 优先于promise执行的微任务
 *  3)argv  参数列表 
 *  4) env 环境变量 win=> set xxx= xxx,mac =>export xxx= xxx  亲测 不生效
 *  5) cwd (current working directory)  当前工作目录
 */


// console.log(Object.keys(process));

/**
 * 1)platform  window =>win32 mac =>darwin  判断用户的系统
 */

// console.log(process.platform);

/** 
 * 2)nextTick 用来代替promise ，是 优先于promise执行的微任务
 */

// Promise.resolve().then(data => {
//   console.log('Promise');
// })
// process.nextTick(() => { // ,
//   console.log('nextTick');
// })

/**
 * 3)argv  参数列表  
 * @use 命令行执行：node process.js--port --config 
 * @param 参数列表的前两个是固定的，1. node 的可执行文件，2当前执行的文件
 * @package commander  可以实现解析参数,根据用户输入的参数，解析为对象
 */

// console.log(process.argv);
// console.log(process.argv.slice(2));   // 从第二个开始是用户传递的参数

// let program = require('commander')
// 1.追加参数信息 2. 解析参数
// program.on('--help', function () { // 监听--help
  // console.log('node xxxx');
// })

// 3.自动配置属性，对应的功能
// program.option('-p, --port <value>', 'set your port')
// 4. 创建指令
// program.command('create').action(function () {
  // console.log('create new vue project');
// })
// 5.添加版本号
// program.version('1.0.0')
// let obj = program.parse(process.argv)
// console.log(obj._optionValues.port);


/**
 * 4) env 环境变量 win=> set xxx= xxx,mac =>export xxx= xxx  亲测 不生效
 * @package cross-env  跨平台设计环境变量，可以安装到全局
 * @command npm i cross-env -g   cross-env b=2 node process.js 生效
 * 
 */
//  console.log(process.env);
//  process.env.foo = 'bar';
//  console.log(process.env.foo);

/**
 * 5) cwd (current working directory)  当前工作目录
 * 在哪运行，就是当前的工作目录
 */

console.log(process.cwd()); 