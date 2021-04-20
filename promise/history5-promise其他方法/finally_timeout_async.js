// 图片加载，请求的加载，造成超时，(不采用成功的结果)


// let abort;
// let p = new Promise((resolve, reject) => {
//   abort = reject
//   setTimeout(() => {
//     resolve('成功')
//   },3000)
// })

// p.abort = abort
// p.then(data => {
//   console.log(data);
// }, err => {
//   console.log(err);
// })
// // 想让p 1s后就便超时
// setTimeout(() => {
//   p.abort('请求超时1s')
// }, 1000)

// ----------------------------------------------------------------

// 使用race 的特点，其中一个失败了，就失败了，
// 构造一个自己的promise和p1 放在一起，简化一下

// function wrap(p1) { // 图片加载问题，脚本超时问题
//   let abort;
//   let p = new Promise((resolve, reject) => {
//     abort = reject
//   })
//   let p2 = Promise.race([p, p1])
//   p2.abort = abort  // 暴露一个终端的方法 
//   return p2;
// }

// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('成功')
//   }, 3000)
// })

// let p2 = wrap(p1)
// p2.then(data => {
//   console.log(data);
// }, err => {
//   console.log(err);
// })
// // 想让p1 1s后就便超时
// setTimeout(() => {
//   p2.abort('请求超时1s')
// }, 1000)

// ----------------------------------------------------------------

// finally  无论成功还是失败，都会执行，并且可以向下执行

let p1 = new Promise((resolve, reject) => {
  abort = reject
  setTimeout(() => {
    // resolve('成功')  // 1
    reject('失败')      // 2
  }, 1000)
}).finally((d) => { //  = then
  console.log('finally'); // finally undefined
  return new Promise((resolve, reject) => { // 不会使用 promise的成功结果
    setTimeout(() => {
      // resolve(1000)  // 3 不会采用成功的结果，但是会等待执行
      reject(9000)      // 4 但是返回一个失败的promise，会走catch，相当于throw new Error
    }, 1000)
  })
}).then(data => {
  console.log(data);
}).catch(e => {
  console.log(e, 'catch');
})
/**
 * 1. 第一步：finally 传递了一个方法 cb 
 * 2. 而finally 方法就是一个then，then方法的特点，就是在函数中返回一个promise，会等待这个promise的完成
 * 3. Promise.resolve 又会等待 cb执行完成
 */

// Promise.prototype.finally = function (cb) {
//   return this.then((data)=>{   // 成功 | 失败
//     // 如何能保证promise执行完毕
//     return Promise.resolve(cb()).then(()=>data)
//   },(err)=>{
//     // Promise.resolve 目的是等待cb() 后的promise完成
//     return Promise.resolve(cb()).then(()=>{throw err})
//   })
// }

// ,(err)=>{
  //     // Promise.resolve 目的是等待cb() 后的promise完成
  //     return Promise.resolve(cb()).then(()=>{throw err})
  //   }

  /**
   * 当最外层的promise reject 时，会有走finally的 err方法，等待Promise.resolve(cb())的执行的结果，
   *  而Promise.resolve只有在成功时候，才会去.then(()=>{throw err}),抛出第一层reject的err信息
   *  cb() 否则当cb结果为失败时，直接以失败的结果， 会直接走catch
  */

/**
 * 整理流程：
 * 组合：
 * 1,3：成功 + 成功 ，走then=>data 抛出 1 返回的数据
 * 1,4：成功 + 失败 ，走then=>err 抛出 4 返回的数据
 * 2,3：失败 + 成功 ，走then=>err 抛出 2 返回的数据
 * 2,4：失败 + 失败 ，走then=>err 抛出 4 返回的数据
 */