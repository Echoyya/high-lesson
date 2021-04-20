// promisify  主要的功能 是将一个异步的方法 转化成 promise形式
// 主要是给node来使用  回调函数的参数永远第一是error ， error-first 原则

const fs = require('fs');
const util = require('util');
let readFile = util.promisify(fs.readFile) // 将方法传递进去，会返回一个promise

// 使用上述返回的promise 方法，特点：参数和以前一样，只是变为promsie形式，可以then，catch等

// readFile('./.gitignore11', 'utf8').then(data => {
//   console.log(data);
// }, err => {
//   console.log(err);
// })
// fs.readFile('./.gitignore','utf8',(err,data)=>{
//   // console.log(err);
//   console.log(data);
// })

// -------------------------------------------------------------

function myPromisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  }
}

// let mReadFile = myPromisify(fs.readFile) 
// mReadFile('./.gitignore', 'utf8').then(data => {
//   console.log(data + 'mReadFile');
// }, err => {
//   console.log(err);
// })

// -------------------------------------------------------------

// 写个方法 ,将fs对象中所有方法读变成promsie的形式
function myPromisifyAll(obj) {
  let o = {}
  for(key in obj){
    if(typeof obj[key] === 'function') o[key+'Promise'] = myPromisify(obj[key])
  }
  return o
}

let newFs = myPromisifyAll(fs)    // bluebird 中有一个类似的库
newFs.readFilePromise('./.gitignore', 'utf8').then(data => {
  console.log(data , 'mReadFile');
}, err => {
  console.log(err);
})