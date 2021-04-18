// let Promise = require('./1.myPromise')

let p = new Promise((resolve, reject) => {
  resolve(1)
})

let p2 = p.then(data => {
  console.log(p2);
  return p2
})


let promise2 = new Promise((resolve, reject) => {
  resolve(1)
}).then(() => {
  return promise2   // TypeError: Chaining cycle detected for promise #<Promise>
})

let p = new Promise((resolve, reject) => {
  resolve(1)
})

let p3 = p.then(data => {
  // console.log(p);
  return p3
})
p.then(data => {
  // console.log(p);
  return p
})
