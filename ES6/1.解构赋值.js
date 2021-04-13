// 1. 如果有关键字，可以采用冒号:的形式进行更改名字
// let { name, default:d } = { name:'eee', default:'xxx' }

// 2. 解构复杂数据结构时，需要对应其结构
let [,{address:[,a]}] = [
  {
    name: 'yya'
  },
  {
    age: 18,
    address: [1, 2, 3, 5]
  }
]

console.log(a);


// 3.可以使用 等号= 设置默认值

let [hobby='游泳'] = []

console.log(hobby);


let {hobby1='滑雪'} = {}

console.log(hobby1);