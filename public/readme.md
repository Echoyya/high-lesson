## 同源策略
协议  域名  端口 (都一样表示 同域)

img link 不受同源策略限制
## 为什么浏览器不支持跨域
cookie localStorage 
DOM元素也有同源策略  iframe
ajax 也不支持跨域

## 实现跨域
- jsonp
- cors ：目前最安全靠谱的
- postMessage
- document.domain
- window.name
- location.hash
- http-proxy
- nginx
- websocket
