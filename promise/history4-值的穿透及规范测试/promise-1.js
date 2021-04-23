

const Promise = require('./1.myPromise')

let p = new Promise((resolve,reject)=>{
  // resolve(1)
  reject(2)   // 同理
})

// Promise 值的穿透，当一个promise连续多次then ，并且then中没有返回任何值时，此时data会穿透值最后一个then中
p.then().then().then(data=>{
  console.log(data);
},err=>{
  console.log(err);    // 2
})

// 相当于, 定义一个函数，不停向下传递
p.then(data=>{
  return data
}).then(data=>{
  return data
}).then(data=>{
  console.log(data);
})
// -------------------------------------------------------------------------------------------------

// 同理 reject 传递的值，也会被穿透
const Promise = require('./1.myPromise')
let p2 = new Promise((resolve,reject)=>{
  reject(2)
})

// p2.then().then().then(data()=>{
//   console.log(data);
// },err=>{
//   console.log(err);
// })


// // 相当于, throw err
p2.then(null,err=>{
  console.log(err);
  throw err+'1'
}).then(null,err=>{
  console.log(err);
  throw err+'2'
}).then(null,err=>{
  // throw err
  console.log(err);
})


/**
 *  called 问题  resolve 是一个普通值 ，不会走失败的
 *  let p2 = new Promise((resolve,reject)=>{
      resolve(2)
    })

    p2.then(data=>{
      return axios('./user',{data})
    }).then()


    new Promise((resolve,reject)=>{
      resolve(11)
      reject(222)
    })
 */
