const Promise = require('./1.myPromise')

/**
 * Promise.resolve()
 * Promise.reject()
 * p.catch
 * Promise.all()
 * Promise.race()
 */


// 一个promise 直接resolve 一个promise的情况,会等待里面的promise执行完，返回成功的执行结果
// reject 一个promise时，不需要单独处理，失败就直接走失败的逻辑，不用处理其返回值

new Promise((resolve, reject) => {
  reject(new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1000)
    }, 1000)
  }))
}).then(data => {
  console.log(data);
}, err => {
  console.log(err, 'err');
})

// ---------------------------------------------------------------------------------------

// 实现promise的几个静态方法
// Promise.resolve() 这个方法 会创造一个成功的promsie

new Promise((resolve, reject) => {
  resolve(100)
}).then(data => {
  console.log(data);
})

// 等价于
Promise.resolve(200).then(data => {
  console.log(data);
})

// 直接成功

Promise.resolve(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(300)
  }, 1000)
})).then(data => {
  console.log(data);
})

// 直接失败,
Promise.reject(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(400)
  }, 1000)
})).then(data => {
  console.log(data);
}, err => {
  console.log(err, 'err');
})

// catch 方法演变过程
new Promise((resolve, reject) => {
  reject('失败')
}).then(data => {
  console.log(data);
}).then(null, err => {
  console.log(err, 'errrrrr');
})

Promise.reject(new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(400)
  }, 1000)
})).then(data => {
  console.log(data);
}).catch(err => {
  console.log(err, 'myCatch');
})

// Promise.all

// 模拟
// Promise.all = function (promises) {
//   return new Promise((resolve, reject) => {
//     let result = []
//     let times = 0
//     const processSuccess = (index, val) => {
//       result[index] = val
//       if (++times === promises.length) {
//         resolve(result)
//       }
//     }
//     for (let i = 0; i < promises.length; i++) {
//       let p = promises[i];
//       if (p && typeof p.then === 'function') {
//         p.then(data => {
//           processSuccess(i, data)
//         }, reject)
//       } else {
//         processSuccess(i, p)
//       }
//     }
//   })
// }
Promise.all([
  1, 2, 3, 
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('成功')
    }, 1000)
  }), 
  new Promise((resolve, reject) => {
    setTimeout(() => {
      // resolve('成功')
      reject('失败')
    }, 1000)})
  ]).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  })


// Promise.finally

// Promise.race
Promise.race([ new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2000)
}), new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve('成功12')
    reject('失败')
  }, 1000)
})]).then(data => {
  console.log(data,'d');
}).catch(err => {
  console.log(err,'e');
})

