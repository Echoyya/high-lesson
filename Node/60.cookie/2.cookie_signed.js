const Koa = require('koa');
const Router = require('koa-router');
const querystring = require('querystring') // 用于解析和格式化网址查询字符串
const crypto = require('crypto')

const app = new Koa();
const router = new Router();

app.keys = ['ya'];
// base64Url 需要特殊处理 + = /
const sign = value => crypto.createHmac('sha1',app.keys.join('')).update(value).digest('base64').replace(/\+/g,'-').replace(/\=/g,'').replace(/\//g,'_');
// 扩展一个设置cookie的方法
app.use(async (ctx, next) => {
  let cookieArr = [];   // cookie 集合
  ctx.req.getCookie = function (key, options = {}) {
    let cookies = ctx.req.headers['cookie']; // name=xx; age=yy => name=xx&age=yy
    let cookieObj = querystring.parse(cookies,'; ')
     
    if(options.signed){
      // 传递过来的签名，和最新计算获得的结果一直，则说明未被修改
      if(cookieObj[key + '.sig'] === sign(`${key}=${cookieObj[key]}`)){
        return cookieObj[key];
      }else {
        return ''
      }
    }
    return cookieObj[key] || ''
  }
  ctx.res.setCookie = function (key, value, options = {}) {
    let args = [];  // 每个cookie 属性集合
    let keyValue = `${key}=${value}`
    options.domain && args.push(`domain=${options.domain}`);
    options.maxAge && args.push(`max-age=${options.maxAge}`);
    options.httpOnly && args.push(`httpOnly=${options.httpOnly}`);
    options.path && args.push(`path=${options.path}`);
    options.signed && cookieArr.push(`${key}.sig=${sign(keyValue)}`);   // 是否开启cookie签名

    cookieArr.push(`${keyValue}; ${args.join('; ')}`);
    ctx.res.setHeader('Set-Cookie', cookieArr); // 字符串数组
  }
  await next();
})

// .keys required for signed cookies
router.get('/visit', async (ctx, next) => {
  // Koa 实现
  // let count = ctx.cookies.get('visit',{ signed: true }) || 0;
  // let visitCount = Number(count) + 1;
  // ctx.cookies.set('visit', visitCount, { signed: true });
  // ctx.body = `you visit ${visitCount}`

  let count = ctx.req.getCookie('visit', { signed: true }) || 0;
  let visitCount = Number(count) + 1;
  ctx.res.setCookie('visit', visitCount, { signed: true });
  ctx.body = `ya visit： ${visitCount}`

})

app.use(router.routes())
app.listen(3000);
