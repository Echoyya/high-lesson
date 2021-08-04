const Koa = require('koa');
const Router = require('koa-router');
const uuid = require('uuid');

const app = new Koa();
const router = new Router();

app.keys = ['ya']
// 用来存储用户和信息的映射关系，对浏览器不可见，
// 同时session 没有持久化功能，需要配合数据库或者redis 使用
const session = {}; 
const cardName = 'connect_sig'; // 卡的名字
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
