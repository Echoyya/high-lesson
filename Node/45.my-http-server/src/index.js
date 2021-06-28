const http = require('http');
const os = require('os');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;   // 将fs中的方法 全部转为promise 的形式
const crypto = require('crypto')
const zlib = require('zlib');

const chalk = require('chalk'); // 粉笔
const mime = require('mime');   // 头信息
const ejs = require('ejs');     // 模板解析

const { createReadStream,readFileSync } = require('fs')
const template = readFileSync(path.resolve(__dirname,'template.html'),'utf8');

class Server {
  constructor(serverOptions) {
    this.port = serverOptions.port;
    this.gzip = serverOptions.gzip;
    this.cache = serverOptions.cache;
    this.directory = serverOptions.directory;
    this.handleRequest = this.handleRequest.bind(this);    // 第一种 指正this 指向
    this.template = template;
  }
  async handleRequest(req, res) {
    // 1. 获取请求路径，以当前目录为基准查找文件，如果文件存在，且不是文件夹则直接返回
    let { pathname } = url.parse(req.url);   // 获取解析路径 
    // 存在中文路径 找不到问题，需要转义
    pathname = decodeURIComponent(pathname) 
    let requestFile = path.join(this.directory,pathname);
    try{
      let statObj = await fs.stat(requestFile)
      if(statObj.isDirectory()){
        const dirs = await fs.readdir(requestFile)
        // 根据数据 和 模板渲染页面(纯服务端渲染)， 并且可点击 查看详情 ，设置a 超链接的跳转路径为相对路径
        // 对资源发送请求，每点一次都会请求服务器
        let fileContent = await ejs.render(this.template,{dirs:dirs.map(dir=>({
          name:dir,
          url:path.join(pathname,dir)
        }))})
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(fileContent)
      }else{
        this.sendFile(req, res,requestFile,statObj)
      }
    }catch(e){
      console.log(e);
      this.sendError(req,res,e);
    }
  }
  cacheFile(req, res,requestFile,statObj){
    // 第一次发送文件，先设置强制缓存，在执行强制缓存时，默认不会执行对比缓存，因为不走服务器
    res.setHeader('Cache-Control','max-age=10');
    res.setHeader('Expires',new Date(Date.now() + 10 * 1000).toGMTString());

     // 每次强制缓存时间到了，就会走对比缓存，然后在变成强制缓存、
    const lastModified = statObj.ctime.toGMTString();
    const etag = crypto.createHash('md5').update(readFileSync(requestFile)).digest('base64');

    res.setHeader('Last-Modified',lastModified);
    res.setHeader('Etag',etag);

    let ifModifiedSince = req.headers['if-modified-since']
    let ifNoneMatch = req.headers['if-none-match']
    // 如果文件修改时间不一样了，就直接返回最新的
    if(lastModified !== ifModifiedSince){    // 有可能时间一样，但是内容不一样
      return false;
    }
    if(etag !== ifNoneMatch){    // 一般情况下，指纹生成不会是全量根据文件生成，有可能只是根据文件大小
      return false;
    }
    return true;
  }
  gzipFile(req, res,requestFile,statObj){ // 浏览器会携带一个accept-encoding 字段，表示浏览器支持的压缩格式
    let encodings = req.headers['accept-encoding'];
    if(encodings){   // 浏览器支持压缩 
      if(encodings.includes('gzip')){
        res.setHeader('Content-Encoding','gzip')   // 浏览器要知道服务器的压缩类型
        return zlib.createGzip()
      }else if(encodings.includes('deflate')){
        res.setHeader('Content-Encoding','deflate')
        return zlib.createDeflate()
      }
    }
    return false;
  }
  sendFile(req, res,requestFile,statObj){
    // 返回文件，需要给浏览器 提供内容类型及内容的编码格式
    res.setHeader('Content-Type',mime.getType(requestFile) + ';charset=utf-8');

    // 判断有没有缓存，如果有缓存，就使用对比缓存
    if(this.cacheFile(req, res,requestFile,statObj)){
      res.statusCode = 304;
      return res.end();
    }

    // 判断是否支持压缩，如果支持返回一个压缩流
    let createGzip;
    if(createGzip = this.gzipFile(req, res,requestFile,statObj)){   
      return createReadStream(requestFile).pipe(createGzip).pipe(res);   // 转化流
    }
    // 根据文件生成一个可读流，而res 是可写流
    createReadStream(requestFile).pipe(res);
  }
  sendError(req,res,e){
    res.statusCode = 404;
    res.end('Not Found');
  }
  start() {
    // const server = http.createServer(this.handleRequest.bind(this))     // 第一种 指正this 指向
    // const server = http.createServer((req, res)=>this.handleRequest(req, res))  // 第二种 指正this 指向
    const server = http.createServer(this.handleRequest) 
    server.listen(this.port, () => {    // 订阅方法，监听成功后会触发
      let WLAN = os.networkInterfaces().WLAN;
      let IP = WLAN[1].address;
      console.log(chalk.yellow(`Starting up http-server, serving`) + chalk.blue('  ./'));
      console.log(chalk.yellow(`Available on:`));
      console.log(`http://${IP}:${chalk.green(this.port)}`);
      console.log(`http://127.0.0.1:${chalk.green(this.port)}`);
      console.log(`Hit CTRL-C to stop the server`);
    })
    server.on('error', err=>{
      if(err.code ='EADDRINUSE'){    // 解决端口被占用的问题，被占用 累加1
        server.listen(++this.port);
      }
    })
  }
}

module.exports = Server