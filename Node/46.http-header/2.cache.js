const http = require('http')
const url = require('url')
const path = require('path');
const fs = require('fs');
const mime = require('mime');

const server = http.createServer((req, res) => {
  let {
    pathname,
    query
  } = url.parse(req.url, true)
  let filepath = path.join(__dirname, 'public', pathname);
  console.log(req.url);
  // res.setHeader('Cache-Control', 'max-age=10');  // 强制缓存和协商缓存配合使用，10s内走强制缓存，超过10s会进行对比，在走协商缓存，同时在设置10s的强制缓存
  
  // 对比缓存 设置文件最后的修改时间，与请求头的时间进行对比，判断是否相同
  res.setHeader('Cache-Control', 'no-cache'); 
  // no-cache  表示会访问服务器，但是浏览器中有缓存
  // 第一次访问服务器，服务器会把文件修改时间返回给浏览器
  // 在下一次请求时，浏览器会携带上次修改的时间，并在服务器端进行两个时间的对比
  // 若不一样，就直接返回最新内容，并给文件设置新的修改时间，反之若一样，则直接返回304状态码，走浏览器的缓存
  // 可以设置不同的匹配规则，采用不同的缓存方式
  
  /**
   * 最后修改时间存在的问题：可能修改时间变了，但是文件内容没变(典型吃了吐) ，
   * 为解决以上问题，可以采用指纹比对的方法
   *  Etag指纹：根据文件内容生成指纹，对比的是文件内容，但是这种方案有一个非常严重的问题，就是比如这个文件非常大，或者说是对比两个较大的视频，发现对比完之后，两个文件一样，就会浪费较多的性能，不是很有必要，所以一般产生指纹不会这么暴力，可以有很多种方案，例如只采取文件的某几行，或者文件的某一部分，在或者文件的大小，粗略的做一个指纹，合理的缓存
   */

  fs.stat(filepath, function (err, statObj) {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found!')
    } else {
      if (statObj.isFile()) {
        const ctime = statObj.ctime.toGMTString();
        // console.log(ctime,req.headers['if-modified-since']);
        if(req.headers['if-modified-since'] === ctime){
          res.statusCode = 304;  // 设置响应状态码，浏览器默认会自动解析，从缓存中读取对应文件
          res.end();  // 表示此时服务器没有响应结果
        }else{
          res.setHeader('Last-Modified',ctime)
          res.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8');
          fs.createReadStream(filepath).pipe(res);
        }
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