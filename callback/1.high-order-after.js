const fs = require('fs')   // file system

let school = {}
// let index = 0;
// const cb = ()=>{
//   if(++index==2){
//     console.log(school);
//   }
// }

function after(times,callback){
  // let arr = []   当取到 的数据需要保证顺序时，可以采用数组，并传递索引给，返回的函数，return (data,index) arr[index] = data
  return ()=>{
    if(--times == 0){   // 多个请求并发，需要靠计数器实现
      callback()
    }
  }
}
let cb = after(2,function(){
  console.log(school);
})

fs.readFile('./a.txt','utf8',function(err,data){
  school.name = data   // 对象形式存储，不需要关心数据的顺序
  cb()
})
fs.readFile('./b.txt','utf8',function(err,data){
  school.age = data
  cb()
})


