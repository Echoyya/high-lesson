let express = require('express')
let app = express()

// 内置的中间件
// 以当前的目前作为静态文件目录，可以直接访问 http://localhost:3000/index.html
app.use(express.static(__dirname))  
app.listen(3000)


// 报错信息   
// Access to XMLHttpRequest at 'http://localhost:4000/getData' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

// 其实整个过程中，ajax肯定是会发送到服务器端，只是服务器返回的结果被浏览器屏蔽掉了