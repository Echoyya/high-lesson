const http = require('http')
const url = require('url')
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const crypto = require('crypto');

const server = http.createServer((req, res) => {
  let {
    pathname,
    query
  } = url.parse(req.url, true)
  let filepath = path.join(__dirname, 'public', pathname);
  
  // 可采用指纹的方式，但是对于大文件，不会直接全量比对
  // 用文件的大小，或开头等生成一个指纹

  fs.stat(filepath, function (err, statObj) {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found!')
    } else {
      if (statObj.isFile()) {
        let content = fs.readFileSync(filepath);
        let etag = crypto.createHash('md5').update(content).digest('base64');
        if(req.headers['if-none-match'] === etag){
          res.statusCode = 304;
          res.end()
        }else{
          res.setHeader('Etag',etag)
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