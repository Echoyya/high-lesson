let express = require('express')
let app = express()


app.use(function(req,res,next){     // 表示是否向下执行
  // 设置可访问该服务器的白名单
  let whiteList = ['http://localhost:3000']
  let origin = req.headers.origin
  if(whiteList.includes(origin)){
    // res.setHeader('Access-Control-Allow-Origin','*')       // 设置* 不允许携带cookie
    res.setHeader('Access-Control-Allow-Origin',origin)       // 设置哪个源 可以访问该服务器
    res.setHeader('Access-Control-Allow-Headers','name,age')  // 设置请求头，多个用逗号分隔
    res.setHeader('Access-Control-Allow-Methods','PUT')       // 设置请求方式，默认只支持get post head ，不支持复杂的请求,多个用逗号分隔
    res.setHeader('Access-Control-Allow-Max-Age','2')         // 设置预请求的存活时间
    res.setHeader('Access-Control-Allow-Credentials',true)       // 设置 允许携带cookie
    res.setHeader('Access-Control-Expose-Headers','name')       // 设置 允许浏览器获取 服务器发送的响应头
  
  }
  next()
})

app.get('/getData',function(req,res){
  console.log(req.headers);   // 会在终端 打印请求头
  res.end('我不爱你')
})
app.put('/getData',function(req,res){
  console.log(req.headers);   
  res.setHeader('name','aaa') 
  res.end('我不爱你')
})
app.use(express.static(__dirname))  
app.listen(4000)


 // options叫做预检请求，就是查看是否可以或者允许跨域请求,也就是在前端真实发送请求时会发送一个预检请求，由他的返回来告知浏览器服务是否允许跨域请求，若不允许则会报CORS的错误。
    // 当 AJAX 发出的是非简单请求时，浏览器才会发送预检（OPTIONS）请求，而且这个预检请求在服务端是可以设置缓存时间的。也就是第一次访问时才会发送预检请求，在缓存的时间内再次请求是不会发送预检请求的

