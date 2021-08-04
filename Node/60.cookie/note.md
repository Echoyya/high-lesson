[toc]

# Cookie
- HTTP协议是`无状态`的，但在WEB应用中，在多个请求之间共享会话是非常必要的，所以出现了Cookie
- cookie是为了`辩别用户身份`，进行会话跟踪而`存储在客户端`上的数据

==服务器设置cookie：客户端第一次访问服务器时,会通过响应头向客户端发送Cookie,属性之间用`分号空格`分隔==

==客户端接收并保存cookie：客户端再请求服务器时，会携带Cookie至服务器端，而cookie本身就是一个请求的header==

## 重要属性
通过修改本地hosts文件，模拟两个不同的域名。 
```js
# hosts
127.0.0.1   a.echoyya.com
127.0.0.1   b.echoyya.com
```
| 属性 | 说明  |
| --- | --- |
| `name=value` | 键值对，可以`设置要保存的 Key/Value`   |
| `Domain`     | 针对某个域名生效 可以跨父域和子域，`默认是当前域名`  |
| `expires/max-age`| cookie存活时间 ,expires 绝对时间， max-age 相对时间 单位秒 |
| secure       | 当 secure 值为 true 时，cookie 在 HTTP 中是无效，只在https下生效 |
| `Path`       | 表示 cookie 影响到的路径，`默认是/`都能被访问到。若`路径不匹配时，浏览器则不发送这个Cookie` |
| `httpOnly`   | 表示浏览器无法通过代码来获取，防止XSS攻击，但是可以通过手动修改控制台方式进行更改。 |

## 实现原理
**`npm install koa koa-router`**

```js
const Koa = require('koa');
const Router = require('koa-router');
const querystring = require('querystring')  // 用于解析和格式化网址查询字符串

const app = new Koa();
const router = new Router();

//  koa 操作cookie 实现原理
app.use(async (ctx, next) => {
  // 扩展一个设置cookie的方法
  let cookieArr = [];
  ctx.req.getCookie = function (key) {
    let cookies = ctx.req.headers['cookie']; // name=xx; age=yy => name=xx&age=yy
    let cookieObj = querystring.parse(cookies,'; ')
    return cookieObj[key] || ''
  }
  ctx.res.setCookie = function (key, value, options={}) {
    let args = []; // 每个cookie 属性集合
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

  ctx.body = 'write ok'; 
})

app.use(router.routes())
app.listen(4000);
```

## cookie签名实现原理
==cookie通常由服务器产生，存在客户端，随着每次请求发送至服务器端，而前端存储数据可以被用户手动篡改，==

==因此可以给cookie签名使其相对安全， 根据cookie的内容产生一个标识，保留原有内容，每次请求检验签名,添加一个配置{ signed: true }==
```js
const Koa = require('koa');
const Router = require('koa-router');
const querystring = require('querystring'); 
const crypto = require('crypto');

const app = new Koa();
const router = new Router();

app.keys = ['ya'];
// base64Url 需要特殊处理 + = /
const sign = value => crypto.createHmac('sha1',app.keys.join('')).update(value).digest('base64').replace(/\+/g,'-').replace(/\=/g,'').replace(/\//g,'_');
app.use(async (ctx, next) => {
  let cookieArr = [];   
  ctx.req.getCookie = function (key, options = {}) {
    let cookies = ctx.req.headers['cookie'];  
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
    let args = [];  
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

// app.keys required for signed cookies
router.get('/visit', async (ctx, next) => {
  // Koa 实现
  // let count = ctx.cookies.get('visit',{ signed: true }) || 0;
  // let visitCount = Number(count) + 1;
  // ctx.cookies.set('visit', visitCount, { signed: true });
  // ctx.body = `you visit ${visitCount}`

  // 自己封装
  let count = ctx.req.getCookie('visit', { signed: true }) || 0;
  let visitCount = Number(count) + 1;
  ctx.res.setCookie('visit', visitCount, { signed: true });
  ctx.body = `ya visit： ${visitCount}`

})

app.use(router.routes())
app.listen(3000);

```

## 注意事项
- 可能被客户端篡改，`使用前验证签名的合法性`，
- `不要存储敏感数据`，比如用户密码，账户余额
- 每次`请求都会自动携带cookie`,尽量`减少cookie的体积`
- `设置正确的domain和path`，减少数据传输

# Session
是另一种记录客户状态的机制，不同的是`Cookie保存在客户端`浏览器中，而`session保存在服务器`上
==在服务器存储用户对应的信息,服务器可以存储敏感信息，而session本身是基于cookie的且比cookie安全==

==同时session 没有持久化功能，需要配合数据库或者redis使用==
## 实现原理
**`npm install uuid`**
```js
const Koa = require('koa');
const Router = require('koa-router');
const uuid = require('uuid');

const app = new Koa();
const router = new Router();

app.keys = ['ya']

const session = {}; // 用来存储用户和信息的映射关系，对浏览器不可见
const cardName = 'connect_sig'; 
router.get('/cut', async (ctx, next) => {
  let id = ctx.cookies.get(cardName, {signed:true});
  if(id && session[id]){
    session[id].mny -= 20;
    ctx.body = `mny:` + session[id].mny;
  }else{
    let cardId = uuid.v4();
    session[cardId] = { mny: 500 };
    ctx.cookies.set(cardName, cardId,{httpOnly:true,signed:true});   // cookie中只存一个标识，并没有真实的数据
    ctx.body = `mny 500`;
  }
})
app.use(router.routes())
app.listen(3000);

```

# JWT
**`JSON Web Token（JWT）`**是目前最流行的跨域身份验证解决方案,JWT 默认是不加密的，任何人都可以读到，所以不要把重要信息放在这个部分。
**解决问题：**session不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。

**优点：**服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展。

## 使用方式
1. HTTP 请求的头信息Authorization字段里面 `Authorization: Bearer <token>`
2. 如果是post请求也可以放在请求体中，取决于后端采用哪种认证方式
3. 通过url传输 `http://www.xxx.com/pwa?token=xxxxx`，但是一般不建议这样使用，因为会存在连接分享导致安全隐患

## 组成
JWT包含了使用`.分隔`的三部分 **`Header.Payload.Signature`**
**1. Header 头部**
```js
{ "alg": "HS256", "typ": "JWT"}   
// algorithm => HMAC SHA256
// type => JWT
```
**2. Payload内容** JWT 规定了7个官方字段
```js
iss (issuer)：签发人
exp (expiration time)：过期时间
sub (subject)：主题
aud (audience)：受众
nbf (Not Before)：生效时间
iat (Issued At)：签发时间
jti (JWT ID)：编号
```
**3. Signature 签名** 

对前两部分的签名，防止数据篡改 `HMACSHA256(base64UrlEncode(header) + "." +base64UrlEncode(payload),secret)`

## 实际应用
**`npm install koa-bodyparser jwt-simple`**
```js
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jwt-simple');
const app = new Koa();
const router = new Router();
app.use(bodyParser())

// 登陆
router.post('/login', async (ctx, next) => {
  let { username,  password } = ctx.request.body;
  if (username == 'admin' && password == 'admin') {
    // let token = jwt.encode(username,'ya');  // jwt-simple 实现
    let token = myJwt.encode(username,'ya');   // 自己实现
    ctx.body = {
      code: 200,
      data: {
        token,
        username
      }
    }
  }
})
// 验证是否有权限
router.get('/validate', async (ctx, next) => {
  let authorization = ctx.get('authorization');
  if(authorization){
    let [,token] = authorization.split(' ');
    try{
      // let r = jwt.decode(token,'ya');   // jwt-simple 实现
      let r = myJwt.decode(token,'ya');    // 自己实现
      ctx.body = {
        code:200,
        data:{
          username:r
        }
      }
    }catch{
      ctx.body = {
        code:401,
        data:'token已失效'
      }
    }
  }
})

app.use(router.routes())
app.listen(3000);
```

## 实现原理
```js
// token组成部分为为三段，1,固定格式表示类型  2,内容 3 签名
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.ImFkbWluIg.xJ0xCP2SXSaJSC-Q1PXuByHdJlBUHCNjdGRU4XW0abU'
const myJwt = {
  sign(str,secret){
    str = require('crypto').createHmac('sha256',secret).update(str).digest('base64');
    return this.toBase64Escape(str);
  },
  toBase64(content){   // 对象转base64 需要先转为buffer => base64
    let source = typeof content === 'string' ? content : JSON.stringify(content);
    return this.toBase64Escape(Buffer.from(source).toString('base64'));
  },
  toBase64Escape(base64){
    return base64.replace(/\+/g,'-').replace(/\//g,'_').replace(/\=/g,'');
  },
  encode(username, secret){   // 转为base64并不是为了安全，只是为了可以在网络中传输
    let header = this.toBase64({typ:'JWT',alg:'HS256'});
    let content = this.toBase64(username);
    let sign = this.sign([header, content].join('.'),secret)
    return header + '.' + content  + '.' + sign
  },
  base64urlUnescape(str){
    str += new Array(5 - str.length % 4).join('=');
    return str.replace(/\-/g, '+').replace(/_/g, '/');
  },
  // 相同的内容生成的签名相同，可以添加一些过期时间等信息 
  // 通过内容生成了一个签名，反之通过校验签名。即可得知内容是否发生改变
  decode(token,secret){
    let [header, content, sign] = token.split('.');
    let newSign = this.sign([header, content].join('.'),secret);
    if(sign === newSign){   // 此时内容line2中的数据一定是可靠的
      return Buffer.from(this.base64urlUnescape(content),'base64').toString();
    }else{
      throw new Error('token已失效')
    }
  }
}
```

# 前端存储方式 cookie session localStorage sessionStorage token 区别
- cookie特点可以每次请求的时候自动携带,可以实现用户登录功能. 使用cookie来识别用户,==1.==如果单纯的使用cookie,不建议存放敏感信息，如果被劫持到。（cookie是存在客户端，并不安全，用户可以自行篡改）==2.==每个浏览器一般对请求头都有大小限制 cookie 不能大于4k，如果cookie过大，会导致页面白屏。 每次访问服务器都会浪费流量（合理设置cookie）;
- session：在服务器存储用户对应的信息,服务器可以存储敏感信息，而session本身是基于cookie的且比cookie安全;
- localStorage：关掉浏览器数据依然存在，除非手动清楚，有大小限制约5M，发送请求不会携带;
- sessionStorage：页面不关闭就不会销毁 （用途：如单页应用访问时存储滚动条地址）
- token -> jwt -> jsonwebtoken 不需要服务器存储，没有跨域限制，不建议存储敏感信息
