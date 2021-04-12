// 模板引擎 实现

// 模板引擎： ejs handlebar underscore jade nunjucks....
// es6中的模板字符串

let mName = "echoyya";
let age = "18";
let str = `${mName}今年${age}岁了`
// // console.log(str);

// // 使用正则实现 正则 分组

let str2 = '${mName}今年${age}岁了'
let tStr2 = str2.replace(/\$\{(.+?)\}/g,function(){
  return eval(arguments[1])
})
// console.log(tStr2);


/**
 * ejs  原理简单实现
 * ejs 属于第三方模块，需要npm install ejs
 * <%%> 中间可以编写js 代码
 * <%=%> 可以获取对应变量的值
 */

let ejs = require('ejs')
let fs = require('fs')
let path = require('path')
var htmlStr = fs.readFileSync(path.resolve(__dirname,'./tem_ejs.html'),'utf8')
var newHtmlStr = ejs.render(htmlStr,{
    // mName,
    // age,
    arr:[1,2,3,4]
  })
  // test
console.log(newHtmlStr);    //   <!-- <%=mName%> <%=age%> -->

