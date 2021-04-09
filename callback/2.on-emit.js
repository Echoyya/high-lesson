// 发布订阅模式 主要分为两个部分


// on 就是把一些函数维护到一个数组中
// emit 就是让数组中的方法一次执行
const fs = require('fs')   // file system

let school = {}

let event = {
  fnArr:[],
  on(fn){
    this.fnArr.push(fn)
  },
  emit(){
    this.fnArr.forEach(fn=>fn())
  }
}

event.on(function(){
  console.log(1);
})
event.on(function(){
  if(Object.keys(school).length === 2){
    console.log(school);
  }
})
fs.readFile('./a.txt','utf8',function(err,data){
  school.name = data
  event.emit()
})
fs.readFile('./b.txt','utf8',function(err,data){
  school.age = data
  event.emit()
})