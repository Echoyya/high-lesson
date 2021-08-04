const Koa = require('koa');
const Router = require('koa-router');
const querystring = require('querystring')  // 用于解析和格式化网址查询字符串

const app = new Koa();
const router = new Router();

//  koa 实现操作cookie 的主要思路
app.use(async (ctx, next) => {
  // 扩展一个设置cookie的方法
  let cookieArr = [];
  ctx.req.getCookie = function (key) {
    let cookies = ctx.req.headers['cookie']; // name=xx; age=yy => name=xx&age=yy
    let cookieObj = querystring.parse(cookies,'; ')
    return cookieObj[key] || ''
  }
  ctx.res.setCookie = function (key, value, options={}) {
    let args = [];
    options.domain && args.push(`domain=${options.domain}`);
    options.maxAge && args.push(`max-age=${options.maxAge}`);
    options.httpOnly && args.push(`httpOnly=${options.httpOnly}`);
    options.path && args.push(`path=${options.path}`);

    cookieArr.push(`${key}=${value}; ${args.join('; ')}`);
    ctx.res.setHeader('Set-Cookie', cookieArr);  // 字符串数组
  }
  await next();
})
 
router.get('/read', async (ctx, next) => {

   // 自己封装
   ctx.body = ctx.req.getCookie('name') || 'empty';

  // koa 实现
  // ctx.body = ctx.cookies.get('name') || 'empty';

  // 原生用法
  // ctx.body = ctx.req.headers['cookie'] || 'empty'; // 请求头
})
router.get('/write', async (ctx, next) => {
  
  // 自己封装
  ctx.res.setCookie('name', 'nn', {domain: '.echoyya.com'});  // 限制可访问的域名
  ctx.res.setCookie('age', '12', {httpOnly: true,path:'/write'});  // 限制可访问的路径

  // koa 实现
  // ctx.cookies.set('name', 'nn', {domain: '.echoyya.com'});
  // ctx.cookies.set('age', '12', {httpOnly: true,path:'/write'});

  // 原生用法
  // ctx.res.setHeader('Set-Cookie','name=yy'); 
  // ctx.res.setHeader('Set-Cookie','age=15'); // 设置一个cookie,再次set cookie 会将上一次的覆盖
  // ctx.res.setHeader('Set-Cookie', ['name=yy; domain=.echoyya.com', 'age=15; path=/; max-age=10; httpOnly=true']); // 设置多个cookie时,可接受一个字符串数组

  ctx.body = 'write ok'
})

app.use(router.routes())
app.listen(4000);