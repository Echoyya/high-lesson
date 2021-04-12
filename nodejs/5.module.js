// 模块加载的顺序问题，

// 1.node版本11.13 默认不写后缀，会先尝试查找文件，优先查找js，在查找json，如果无法查找到，继续查找文件夹下的index.js
// 如果对象文件下的入口文件，并不是index.js 命名，可以把文件夹变成一个包，需要创建一个package.js文件，来描述这个包的入口文件

// 如果有package.js  会以该文件定义的入口未见为准

let a = require('./a')
let b = require('./b')     // 查找b文件夹，区分有无package.json
console.log(a);
console.log(b);

// 2. 以前的版本，会先去查找包，默认包中有index.js 文件，不会去读取packsge.json

// 3. 如果没有相对或绝对路径，可能是核心模块，或是第三方模块，会查找node_modules
// npm install xxx

console.log(module.paths);  // 第三方查找的顺序

[
  'c:\\Echoyya\\Higher-lesson\\nodejs\\node_modules',
  'c:\\Echoyya\\Higher-lesson\\node_modules',
  'c:\\Echoyya\\node_modules',
  'c:\\node_modules'
]

