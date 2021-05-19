## 下载
http://nginx.org/en/download.html

## 启动
直接解压，运行.exe文件

## 访问
http://localhsot


## 创建服务器文件
nginx-1.19.10/json/a.json 添加内容

## 修改配置文件
nginx-1.19.10/conf/nginx.conf

配置头，同cors配置
```
location ~.*\.json {
    root   json;
    add_header "Access-Control-Allow-Origin" "*";
}
```
## 重载nginx 
cd nginx-1.19.10
nginx -s reload