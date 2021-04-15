const fs = require('fs')

const Promise = require('./1.myPromise')

function read(filepath){
  return new Promise((resolve,reject)=>{
    fs.readFile(filepath,'utf8',function(err,data){
      if(err) return reject(err)
      resolve(data)
    })
  })
}

read('./name.txt').then(data=>{
  return read(data)
},err=>{
  console.log(err);
}).then(data=>{
  console.log(data);   //  18
})

// ---------------------------------------------------------------------------------- 
// 既然promise是为了解决异步回调函数嵌套问题，那么可以通过promise的延迟对象来减少一层嵌套关系

function readDefer(filepath){
  let dfd = Promise.defer()
  fs.readFile(filepath,'utf8',function(err,data){
    if(err) return dfd.reject(err)
    dfd.resolve(data)
  })
  return dfd.promise
}

readDefer('./name.txt').then(data=>{
  return readDefer(data)
},err=>{
  console.log(err);
}).then(data=>{
  console.log(data);   //  18
})