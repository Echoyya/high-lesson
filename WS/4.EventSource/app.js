let express = require('express')
let app = express()
app.use(express.static(__dirname))
/**
 * **`服务器端:`**
  1. 事件流的对应MIME格式为`text/event-stream`。
  2. 服务器向浏览器发送的 SSE 数据，必须是 UTF-8 编码的文本
  3. 服务端返回数据需要特殊的格式，分为`四种消息类型`，且消息的每个字段使用"\n"来做分割，
    - **`Event`**: 事件类型，支持自定义事件
    - **`Data`**: 发送的数据内容，如果数据很长，可以分成多行，用\n结尾，最后一行用\n\n结尾。
    - **`ID`**: 每一条事件流的ID，相当于每一条数据的编号，
    - **`Retry`**：指定浏览器重新发起连接的时间间隔。在自动重连过程中，之前收到的最后一个ID会被发送到服务端。
 */

let counter = 0
app.get('/clock',function(req,res){
  res.header('Content-Type','text/event-stream')
  let $timer = setInterval(() => {
    // 第一种写法
    res.write(`id:${counter++}\nevent:message\ndata:${new Date().toLocaleString()}\n\n`)

    // 另一种写法
    res.write(`event:yya\n`)     // 触发 自定义事件
    res.write(`data:${counter}\n\n`)
  }, 1000 );
  
  res.on('close',function(){
    counter = 0
    clearInterval($timer)
  })
})

app.listen(3000)