#! /usr/bin/env node
 // 以上代码为声明该文件的运行方式，使用node环境去运行

// console.log('ok');

// 命令行的帮助文档
const program = require('commander')
const options = require('./config')
program.name('mhs')
program.usage('[option]')

// 解析 当前运行进程 传递的参数
const examples = new Set();
const defaultMapping = {};
Object.entries(options).forEach(([key, value]) => { // 参数是个数组，需要解构
  examples.add(value.usage)
  defaultMapping[key] = value.default
  program.option(value.option, value.description)
})
program.on('--help', function () {
  console.log('\nExamples:');
  examples.forEach(item => {
    console.log(`  ${item}`);
  })
})

program.parse(process.argv)

// 获取用户输入的参数
let userArges = program.opts() 

// 自定义的默认值
// console.log(defaultMapping);

// 合并用户传递的参数及默认值，且默认值优先级最低
let serverOptions = Object.assign(defaultMapping,userArges)
// console.log(serverOptions);

// 启动服务
const Server = require('../src/index');
let server = new Server(serverOptions);
server.start()

