const fs = require('fs')   // file system

let school = {}
// let index = 0;
// const cb = ()=>{
//   if(++index==2){
//     console.log(school);
//   }
// }

function after(times,callback){
  return ()=>{
    if(--times == 0){
      callback()
    }
  }
}
let cb = after(2,function(){
  console.log(school);
})

fs.readFile('./a.txt','utf8',function(err,data){
  school.name = data
  cb()
})
fs.readFile('./b.txt','utf8',function(err,data){
  school.age = data
  cb()
})


