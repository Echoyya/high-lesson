const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const jwt = require('jwt-simple');
const app = new Koa();
const router = new Router();
app.use(bodyParser())

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
// 登陆
router.post('/login', async (ctx, next) => {
  let { username,  password } = ctx.request.body;
  if (username == 'admin' && password == 'admin') {
    let token = myJwt.encode(username,'ya'); // 不要放敏感信息
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
      let r = myJwt.decode(token,'ya');
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