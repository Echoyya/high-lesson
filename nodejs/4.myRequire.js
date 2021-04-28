// 执行过程
/**
 * 1. 先将./a 的文件转化为绝对路径
 * 2. 读取这个文件，需要增加一个函数，函数内部需要module.exports 导出模块
 * 3. 让函数执行
 */
 
// 1. Module._load   加载模块
// 2. Module._extensions 代表一个对象，存放着很多处理的方法， 如：'.js'(){}
// 3. Module 根据文件名创建模块  exports  id
// 4. Module._resolveFilename  解析绝对路径  |||  从模块中去缓存。第一次找不到
// 5. 最终返回的是module.exports
// 6. Module._cache模块缓存对象，映射表，多次加载 ，读取缓存 

const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module(id) {
  this.id = id
  this.exports = {}
}

function resolveFilename(filename) {
  let r = path.resolve(__dirname, filename)
  // 需要看下文件路劲是否存在，如果不存在尝试添加 .js  .json后缀
  let isExists = fs.existsSync(r)
  if (isExists) {
    return r
  } else {
    let key = Object.keys(Module._extensions)
    for (let i = 0; i < key.length; i++) {
      let ext = key[i];
      let tryFilename = r + ext
      if (fs.existsSync(tryFilename)) {
        return tryFilename
      }
    }
    throw new Error('module not found')
  }
}
let wrapper = [
  '(function(exports,require,module,__filename,__dirname){',
  '\n})'
]
Module._cache = {}
Module._extensions = {
  '.js'(module) {
    let script = fs.readFileSync(module.id, 'utf8')
    let fnStr = wrapper[0] + script + wrapper[1]
    let fn = vm.runInThisContext(fnStr)
    let exports = module.exports // exports 和 module.exports
    // 不能直接改变exports  是不会影响module.export
    fn.call(exports, exports, myRequire, module, module.id, path.dirname(module.id))
  },
  '.json'(module) {
    let script = fs.readFileSync(module.id, 'utf8')
    module.exports = JSON.parse(script)
  }
}

function tryModuleLoad(module) {
  // 获取文件的后缀名
  let ext = path.extname(module.id) // a.js
  Module._extensions[ext](module) // 对不同的后缀，执行不用的方法
  // console.log(ext);    // 后缀
}

function myRequire(filename) {
  // 先将路径转化为绝对路径  c:\Echoyya\Higher-lesson\nodejs\a.js
  let id = resolveFilename(filename)
  console.log(id);
  let cacheModule = Module._cache[id]
  if (cacheModule) return cacheModule.exports // 实现模块的缓存机制
  let module = new Module(id)
  Module._cache[id] = module
  // 加载这个模块
  tryModuleLoad(module)
  return module.exports
}

let str = myRequire('./a.json')
// str = myRequire('./a.json')
// str = myRequire('./a.json')
// str = myRequire('./a.json')
// let str1 = require('./a')   // 原生
console.log(str);