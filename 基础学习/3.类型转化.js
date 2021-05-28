// 1) 数字和非数字类型相加, 会尝试将其他类型转换为数字类型，
console.log(1+true);  // 2
console.log(1+null);  // 1
console.log(1+undefined);  // NaN

// 2) 数字和非数字类型相加, 当不能转为数字时，会尝试将其转化为字符串
console.log(1+{});  // 1[object Object]


// 3) 非数字相加，会尝试将两者都转为数字，在尝试将其转为字符串,如果有一方是字符串，并会进行字符串拼接运算
console.log(true + true); // 2
console.log(true + {});   // true[object Object]


// 4) 对象中有两个方法   先valueOf()  再toString()
let obj = {
  valueOf(){
    // return 100    
    return {}   // 一般情况下返回的不是原始类型
  },
  toString(){
    return 200  // 当valueOf 返回的不是原始数据类型时。会调用toString方法
  }
}
console.log(true + obj );   // 101 201 会先调 valueOf?
console.log({}.valueOf() ); // {} 一个对象通过valueOf后，还不能转成字符串时，才会去调用toString()

// let a ={name:'yya'}
// console.log(a.valueOf() );   // { name: 'yya' }
// console.log(a.toString() );  // [object Object]

// ----------------------------------------------------------------------------
let obj1 = {
  valueOf(){
    return {}   
  },
  toString(){
    return {}  // 当 toString 也返回一个空对象时。在转换就会报错
  }
}
console.log(true + obj1 );   // Cannot convert object to primitive value
// ----------------------------------------------------------------------------
// 有意思的事情： a == 1 && a == 2 && a == 3
{
  let count = 1
  let a = {
    valueOf: function(){return count++}
  }
  if(a==1 && a==2 && a==3){
    console.log(a==4 && a==5 && a==6) // true
  }
}
// 有意思的事情： a === 1 && a === 2 && a === 3
{
  let count = 1;
  Object.defineProperty(global, 'a', {
      get: function() {
          return count ++;
      }
  });
  console.log(a===1 && a===2 && a===3)
}

// ----------------------------------------------------------------------------
// 可以自行定义转化的方法，默认会先走自己定义的
let obj2 = {
  [Symbol.toPrimitive](){
    return 500
  },
  valueOf(){
    return 100  
  },
  toString(){
    return 200  
  }
}
console.log(true + obj2 );   // 501
// ----------------------------------------------------------------------------

// 5) + - !  (+ 'a')  会被转为数字
console.log(typeof + 'a');  // number
console.log(1 + '123');    // 1123
console.log(1 + + '123');  // 124


// 6) 比较运算 > < == 

console.log(2 < '123');    // true   一方是数字，会尝试将另一方转为数字，进行比较      
console.log('2' < '123');  // false  两者都是字符串，比较的是ascii 码值
console.log(2 < 'aaa');    // false  一方是数字，会尝试将另一方转为数字，若不能转为数字，则返回false
console.log('2' < 'aaa');  // true  比较的是ascii 码值

// ==
console.log(null == undefined);  // true 
console.log(null == 0);          // false  null 和 undefined 和其他类型比较都会返回false
console.log(undefined == 0);     // false 
console.log({} == {});     // false  比较引用地址
console.log(NaN == NaN);   // false  NaN 和任何类型比较都不相等
console.log([] == ![]);    // true
/**
 * [] == ![]  !为单目运算符，优先级最高
 * [] == false
 * [] == 0 
 * [] == 0
 * '' == 0
 *  0 == 0  true
 */
 console.log({} == '[object Object]');  // 对象和字符串，数字symbol比较时，会把对象转换成原始数据类型(先valueOf()  再toString())


