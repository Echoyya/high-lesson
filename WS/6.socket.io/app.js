let express = require('express')
let app = express()
app.use(express.static(__dirname))
let SYSTEM = '系统消息'
let sockets = {}

let server = require('http').createServer(app)
let io = require('socket.io')(server)

io.on('connection',function(socket){
  let username = '';
  socket.on('message',function(data){
    if(username){
      let result = data.match(/@([^ ].+) (.+)/)
      console.log(result);
      if(result){   // 如果匹配，既是私聊
        let toUser = result[1]
        let toContent = result[2]
        let toSocket =  sockets[toUser]
        toSocket && toSocket.emit('message',emitMsg(toContent,username))
      }else{   // 否则是公聊
        io.emit('message',emitMsg(data,username))
      }
    }else{
      // 如果用户名没有设置过的话
      let oldSocket = sockets[data]
      if(oldSocket){
        socket.emit('message',emitMsg(`${data}已经被占用,请换一个用户名`))
      }else{
        username = data // 把这个消息的内容 ，设置为当前用户的用户名
        // 把用户名和对应的socket对象进行关联
        sockets[username] = socket
        // 系统消息 通知所以客户端有新的用户 加入了聊天室
        socket.broadcast.emit('message',emitMsg(`${username}进入房间`))
      }
    }
  })
})

function emitMsg(content,username=SYSTEM){
  return {content,username,createAt:new Date()}
}

server.listen(3000)