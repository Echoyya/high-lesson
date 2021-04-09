let fs = require('fs');
let Promise = require('./1.myPromise')


// function read(filepath){
//   return new Promise((resolve,reject)=>{
//     fs.readFile(filepath,'utf8',function(err,data){
//       if(err) return reject(err)
//       resolve(data)
//     })
//   })
// }


// 调用 p1.resolve(100)   => p1.then(data)
//      p2.resolve(100)   => p2.then(data)
let p1 = new Promise((resolve, reject) => {
  resolve(1111111)
})

// let p2 = p1.then(data=>console.log('**' + data + '**',22222), err => '失败')
let p2 = p1.then(data=> {
  throw new Error()
}, err => '失败')

p2.then(data => console.log('**' + data + '**'), err => console.log('失败2'))