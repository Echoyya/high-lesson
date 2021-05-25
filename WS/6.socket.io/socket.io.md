# 基本介绍
  socket.io 是一个websocket库，包含了客户端的js和服务器端的nodejs，目标是构建可以在不用浏览器和移动设备上使用的实时应用
  
# 优点
  1. 易用性：封装了客户端和服务器端，使用方便
  2. 跨平台性：支持跨平台，
  3. 自适应：会自动根据浏览器从websocket，ajax长轮循， iframe流等各种方式中选择最佳的方式来实现网络实时应用，支持浏览器最低达到IE5.5 

# 安装  
  `npm install socket.io`

# 用法
## 命名空间：服务器端划分命名空间，客户端连接，命名空间

## 客户端

引入：`<script src="/socket.io/socket.io.js"></script>`
实例：`let socket = io.connect('/')`

**其中`/` 并非浏览器中的路由，而是命名空间，不同命名空间的消息是隔离的，是不能互相通信的**

通过`on`监听对应的方法，

常用方法:`connect`，`disconnect`,`message` (被源码封装为了`send`)

## 服务器端
```js
let express = require('express')
let app = express()
app.use(express.static(__dirname))

let server = require('http').createServer(app)
let io = require('socket.io')(server)

// io.of('/').on('connection',function(socket){})   // 完整的命名空间，可以省略/,默认/ 
io.on('connection',function(socket){
  console.log('服务器接收到客户端的连接');
  socket.on('message',function(data){
    console.log(data);
    // socket.send方法只是语法糖，内部是封装了 socket.emit('message',data) 方法，1.使得代码更加语义化 2. 语法更简洁 
    socket.send('服务器说:'+ data)    
  })
})
server.listen(3000)
```
# 广播
## 全局广播
### 向大厅和所有房间内的人广播
客户端发送： `socket.send(content)`
服务端广播： `io.emit('messgae',content)`
客户端监听： `socket.on('messgae',function(data){})`

### 具名发言
声明一个变量，存储用户第一次输入的信息为当前登录用户的用户名，判断username 是否存在，非首次登录，则直接弹出消息
```js
 if(username){
      io.emit('message',emitMsg(data,username))
    }else{
      username = data // 把这个消息的内容 ，设置为当前用户的用户名
      // 系统消息 通知所以客户端有新的用户 加入了聊天室
      io.emit('message',emitMsg(`${username}进入房间`))
    }
```
### 向除了自己外的所有人广播
`socket.broadcast.emit('message',data)`
## 房间内广播，
一个客户端可以同时进入多个房间，大厅里广播，大厅和房间都能收到消息，房间内广播和通信不会影响房间以外的客户端
### 进入房间
`socket.join(roomName)`
### 离开房间
`socket.leave(roomName)`

1. 从服务器的角度来提交事件，提交者会包含在内：(在此房间内的所有客户端都会受到消息)
`io.in(roomName).emit('message',data)`
`io.of('/').in(roomName).emit('message',data)`

2. 从客户端的角度来提交事件，提交者会排除在外,(此房间内除了自己的所有客户端，都会收到消息)
`socket.broadcast.to(roomName).emit('message',data)`

## 聊天室主要功能描述
1. 创建客户端与服务器端的websocket通讯连接
2. 客户端与服务器端相互发送消息
3. 添加用户名
4. 添加私聊
5. 进入/离开房间聊天
6. 历史消息