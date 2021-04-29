// this 指代的是当前模块的导出对象
console.log(module.exports === exports, module.exports === this); // true true

module.exports = 'hello' // 更改module.exports，优先级是最高的，最终会将module.exports直接导出
exports.a = 'a'
this.a = 'b'

/**
 *  function () {
  let exports =  module.exports = {}
  module.exports = 'hello'
  exports.a = 'a'
  exports.b = 'b'
  return  module.exports
  }
 */

// npm
console.log(module.paths);

// 包的安装，
// 1).全局模块=>安装到电脑中的npm下

/**
 * 3n模块
 * npm
 * nrm: node registry manager
 * nvm: node version mansger
 */

// npm 默认在电脑的环境变量中，所以可以直接使用，安装在全局的模块，也都在nom下生成了一个快捷方式
// 全局安装只能在命令行中执行，自己实现的全局包
/**
 * 1. 需要在package.json中，配置bin命令
 * 2. 添加执行方式 #！ /usr/bin/env node  当前环境变量里面的node执行该脚本
 * 3. 将此包放到npm下，(可以全局安装) 临时做一个npm link 软链，方便调试
 */
//  2).本地安装
// 依赖关系:(开发依赖webpack gulp  生产依赖vue ) 同等依赖 打包依赖 可选依赖
// npm install --sava  --save-dev(-D)

// npm5.2之后 灰白共同的模块拍平
// .bin 模块意味着 安装的一些模块可以在命令行中执行

// 如果直接使用npm run script的方式，默认在执行命令之前，会将环境变量添加到全局下，所以可以使用，但是在命令执行完毕后会删除对应的path

// npx 和 npm run 类似，npx如果模块不存在，会先安装在使用，使用后可以自动删除

// 版本号： semver (major.minor.patch)
// npm version major  v2.0.0
// npm version minor  v2.1.0
// npm version patch  v2.1.1


/**
 * 包的发布
 * 1. 确认包的名字是否重名
 * 2. 切换本地npm源到官方
 * 3. npm addUser 登录
 * 4. npm publish 上传
 * 5. npm version major 更新版本号
 * 6. npm unpublish --force 取消上传，下架
 * 7. 下架之后，24小时不可在上传同名包
 */
