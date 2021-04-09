let fs = require('fs');

/**
 * 需求：先读取name文件，取到下一个文件的路径，在读取该文件 
 * */

// error first 原则，异步方法无法通过try catch 捕获异常
// fs.readFile('./name.txt','utf8',function(err,data){
//   fs.readFile(data,'utf8',function(err,data){
//     console.log(data);
//   })
// })


function read(filepath) {
  return new Promise((resolve,reject)=>{
    fs.readFile(filepath,'utf8',function(err,data){
      if(err) return reject(err)
      resolve(data)
    })
  })
}
// 1. promise 成功和失败的回调的返回值，可以传递给外层的then
// 2. 如果返回的是 普通值的话（传递到下一次的成功中,不是错误不是promise就是普通值，包括对象），出错的情况(一定会走到下一次的失败)，可能还要promise的情况(会采用promise的状态，决定下一次的成功还是失败)
// 3. 错误处理，如果离自己最近的then没有错误处理(没有写错误处理) ，会向下找
// 4. 每次执行完promise.then 方法后返回的都是一个“新的promise”   因为原有的promise状态一旦发生改变，就不能再改变，不符合实现规范
read('./name1.txt').then(data=>{
  // console.log('-----success1--------',data);
  // return 100
  return read(data+'1')    // promise的状态，决定下一次的成功还是失败
},err=>{
  // console.log('-----failed1--------',err);
  // return 200
  throw new Error('e')
}).then(data=>{
  console.log('-----success2--------',data);  // 100 200
},err=>{
  console.log('-----failed2--------',err);
})