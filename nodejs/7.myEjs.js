// 自己实现 模板引擎 ejs
/**
 * ejs  原理简单实现
 * ejs 属于第三方模块，需要npm install ejs
 * <%%> 中间可以编写js 代码
 * <%=%> 可以获取对应变量的值
 */



// 步骤：
//1. 去掉所有 <% | %>
let fs = require('fs')
let path = require('path')
var htmlStr = fs.readFileSync(path.resolve(__dirname, './tem_ejs.html'), 'utf8')
var newHtmlStr = render(htmlStr, {
  arr: [1, 2, 4, 5, 6]
})


// 使用到 with   new Function reg
function render(htmlStr, obj) {
  let head = 'let str = ""\r\nwith(obj){\r\n'
  head += 'str+=`'
  htmlStr = htmlStr.replace(/<%=(.+?)%>/g, function () {
    return '${' + arguments[1] + '}'
  })
  let content = htmlStr.replace(/<%(.+?)%>/g, function () {
    return '`\r\n' + arguments[1] + '\r\nstr += `'
  })
  let tail = '`\r\n return str \r\n}'
  let fn = new Function('obj', head + content + tail)
  return fn(obj)
  // console.log(fn.toString());
}
console.log(newHtmlStr);