const http = require('http')
const url = require('url')
const path = require('path');
const fs = require('fs');
const mime = require('mime');

// 这里指的缓存，指代的静态文件的缓存 动态数据缓存需要走redis

const server = http.createServer((req, res) => {
  let {
    pathname,
    query
  } = url.parse(req.url, true)
  // 如果返回的是一个html,html中引用了其他模块，会在向服务器发送请求
  // 强制缓存：针对浏览器直接访问时，不走强制缓存的，也就是第一次访问时，必然会请求到服务器端，因为如果连首页都走缓存了，那么在断网的情况下也可以访问该网站，显然是不合理的
  let filepath = path.join(__dirname, 'public', pathname);
  console.log(req.url);

  // 强制缓存：服务器要和客户端说，下次别找我了,设置一个最大的存活时间
  // 强制缓存：不对首次访问的路径做处理，后续的资源10s内不会在请求服务器
  // 可以根据不同的文件后缀，设置不同的强制缓存的时间
  // 缓存类型：disk cache 和 memory cache 代码无法控制
  // 一般都是在nginx层做处理，但核心是一样的，都是设置header   
  /**
   * Cache-Control 值
   * 1. no-cache: 每次都向服务器发送请求，会存到浏览器的缓存中 
   * 2. no-store：每次都向服务器发送请求，不会存到浏览器缓存中 
   */
  res.setHeader('Cache-Control', 'max-age=10'); // 10s 表示当前时间 + 10s，属于相对时间 (用于新版浏览器)
  res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString()); // 设置 绝对时间 (用于旧版浏览器或IE老版本 或http1.0)，
  // 设置header时，值只能是数字，字符串或数组，不能设置为对象，new Date()返回的是对象，所以需要转化一下。
  fs.stat(filepath, function (err, statObj) {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found!')
    } else {
      if (statObj.isFile()) {
        res.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8');
        fs.createReadStream(filepath).pipe(res);
      } else {
        // 如果是目录，需要找目录下的index.html
        let htmlPath = path.join(filepath, 'index.html')
        fs.access(htmlPath, function (err) {
          if (err) {
            res.statusCode = 404;
            res.end('Not Found!')
          } else {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            fs.createReadStream(htmlPath).pipe(res)
          }
        })
      }
    }
  })
});

server.listen(3000, function () {
  console.log('server is running....');
})