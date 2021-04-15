// 深拷贝：拷贝后的结果更改不会影响拷贝前的，拷贝前后没有关系
// 浅拷贝：改变拷贝前的内容，会对拷贝之后的有影响，拷贝前后有关联


// 引用关系, 多层嵌套时，拷贝的仅是引用地址
// ... 运算符 只能拷贝一层 (浅拷贝)
 let obj = {name:'yya',address:{x:100,y:200}}
 let o = {...obj}
 obj.name = 'echo'

 console.log(obj,o);


let a = [1,2,3]
let b = [a]  // 二维数组
let c = b.slice()
c[0][0] = 100

console.log(b);   // [ [ 100, 2, 3 ] ]



// 深拷贝
let obj1 = {name:'yya',address:{x:100,y:200}}
let o1 = JSON.parse(JSON.stringify(obj1))   // 产生一个字符串，在将字符串转化为对象，
obj1.address.x  = 500
console.log(obj1,'\n',o1);

// 但是 stringify 有缺陷，在转化的时候，会丢失一些属性，如 undefined ，function 正则等
let obj2 = {name:'yya',address:{x:100,y:200},f:function(){},n:null,u:undefined}
let o2 = JSON.parse(JSON.stringify(obj2))   // 产生一个字符串，在将字符串转化为对象，
console.log(obj2,'\n',o2);




// 实现一个拷贝，递归
function deepClone(obj,hash=new WeakMap()){
  if(obj == null) return obj // 如果是null || undefined 不拷贝，直接返回
  if(obj instanceof Date) return new Date(obj)
  if(obj instanceof RegExp) return new RegExp(obj)
  // 对象或者普通值， 如果是函数。也不许需要拷贝，直接返回
  if(typeof obj !='object') return obj
  // 是对象就要进行深拷贝 
  if(hash.get(obj)) return hash.get(obj)
  // []  {}  Object.prototype.toString.call(obj) == '[object Array]' ? [] : {}
  let cloneObj = new obj.constructor()  // 可以保留类的继承关系
  hash.set(obj,cloneObj)
  for (let key in obj) {
    // cloneObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key],hash ) : obj[key]  // 方法1
    cloneObj[key] = deepClone(obj[key],hash )   // 方法2
    console.log(cloneObj);
  }
  return cloneObj;
}

let obj3 = {name:'yya',address:{x:100,y:200},f:function(){},n:null,u:undefined} 
obj3.o = obj3  // 循环引用，会导致内存溢出，使用weakmap 缓存进行判断，有则直接return
deepClone(obj3);
// console.log(deepClone(obj3));
