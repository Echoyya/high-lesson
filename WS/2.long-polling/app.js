let express = require('express')
let app = express()
app.use(express.static(__dirname))

// 首先res.end()是能传数据到客户端的，同时通知客户端响应消息已结束，send是express提供的简化函数，相当于setHeader+write+end
app.get('/clock',function(req,res){
  let $timer = setInterval(() => {
    let date = new Date()
    let seconds = date.getSeconds()
    if(seconds % 5 == 0){
      res.send(date.toLocaleString())
      clearInterval($timer)
    }
  }, 1000);
})

app.listen(3000)