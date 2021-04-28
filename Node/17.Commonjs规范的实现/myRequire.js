// 解析流程
/**
 * 1. require 方法：Module.prototype.require 方法
 * 2. Module._load  加载模块（静态方法，通过类调用）
 * 3. Module._resolveFilename  解析路径，将相对路径转为绝对路径 添加了后缀名(.js .json 常用) .node
 * 4. module = new Module (如果不是原生陌模块)，拿到绝对路径创造一个模块，this.id 路径，module.exports 
 * 5. module.load 使用原型上的方法对模块进行加载 (Module._nodeModulePaths  查找第三方模块，一层一层找node_modules)
 * 6. Module._extensions['.js'] 找文件扩展名，不同的文件对应不同的加载方式，采用策略加载模式，减少if else的判断，转为key value形式
 * 7. module._compile   用的是同步读取文件fs.readFileSync，将读取的内容传递给_compile方法
 * 8. 增加一个函数的壳子，并且让函数执行，让module.exports 作为了this  wrapSafe(filename, content, this);  包装了一层函数
 * 9. 用户会默认拿到module.exports 的返回结果
 * 10. 同一个模块被多次加载，需要对结果进行缓存 
 * 
 * !!!!是程序更完善，边界值的判断
 */
// 最终返回的是return module.exports;对象
const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module(id) { // 没有使用Class，而是构造函数，原因是node比较老，为了兼容以前的写法
  this.id = id
  this.exports = {}
}
Module._cache = []
Module._extensions = {
  '.js'(module){
    let script = fs.readFileSync(module.id,'utf8')
    // vm.runInThisContext(`(function(exports,require,module,__filename,__dirname){${script}})()`)
    let templateFn = `(function(exports,require,module,__filename,__dirname){\n${script}})`
    let fn = vm.runInThisContext(templateFn)
    // console.log(fn.toString());
    let exports = module.exports  // this = module.exports = exports
    let thisValue = exports
    // fn(exports, req, module, module.id, path.dirname(module.id))
    fn.call(thisValue, exports, req, module, module.id, path.dirname(module.id))  // 调用了a 模块，module.exports = 100
  },
  '.json'(module){
    let script = fs.readFileSync(module.id,'utf8')
    module.exports = JSON.parse(script)
  }
}
Module._resolveFilename = function (id) {
  let filepath = path.resolve(__dirname,id)
  let isExist = fs.existsSync(filepath)
  if(isExist) return filepath
  // 否则表示不存在，尝试添加后缀
  let keys = Object.keys(Module._extensions)
  for (let i = 0; i < keys.length; i++) {
    let newPath = filepath + keys[i];
    if(fs.existsSync(newPath)) return newPath
    throw new Error('module not found')
  }
}
Module.prototype.load = function () {
  let ext = path.extname(this.id)
  Module._extensions[ext](this)
  
}
function req(filename) {
  filename = Module._resolveFilename(filename) // 1. 创造一个绝对引用地址，方便后续读取
  let cacheModule = Module._cache[filename]
  if(cacheModule) return cacheModule

  const module = new Module(filename)   // 2. 根据路径 创造一个模块
  Module._cache[filename] = module  // 最终：根据文件名来 缓存模块，因为文件名不能冲突
  module.load()  // 就是把module.exports 传给用户，让用户给module.exports 赋值，
  return module.exports  // 默认空对象
}
let a = req('./a')
a = req('./a')
a = req('./a')
console.log(a);