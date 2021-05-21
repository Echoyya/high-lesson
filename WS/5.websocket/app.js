let express = require('express')
let app = express()
app.use(express.static(__dirname))

app.listen(3000)

let WebSocket = require('ws')
let wss = new WebSocket.Server({port:8888})
wss.on('connection',function(ws){
  console.log('2.服务器监听到了客户端的连接',new Date().getTime());
  ws.on('message',function(data){
    console.log('4.客户端发来的消息',data);
    ws.send('5.服务端说：你也好')
  })
})