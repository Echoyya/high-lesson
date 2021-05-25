/**
 * 1. reduce => myReduce 
 * 2. forEach => myForEach  
 * 3. map => myMap   
 * 4. filter  
 * 5. find  
 * 6. some  
 * 7. every  
 * 8. includes  
 * 9. Array.from  
 * 10. Array.of  
 * 11. 交集  
 */

// 1. reduce => myReduce  收敛 累加器，返回累加后的结果
{
  Array.prototype.myReduce = function (fn, prev) {
    for (let i = 0; i < this.length; i++) {
      if (typeof prev === 'undefined') {
        prev = fn(this[i], this[i + 1], i + 1, this)
        i++;
      } else {
        prev = fn(prev, this[i], i, this)
      }
    }
    return prev
  }

  let r = [1, 2, 3].reduce((prev, next, index, arr) => {
    return prev + next
  }, 0)

  // console.log(r);

  let rr = [1, 2, 3].myReduce((prev, next, index, arr) => {
    return prev + next
  })

  // console.log(rr);

  // 对象数组   求和
  let priceArr = [
    {    price: 10  }, 
    {    price: 20  }, 
    {    price: 30  }
  ]
  let rrr = priceArr.myReduce((prev, next, index, arr) => {
    return prev + next.price
  }, 0)

  // console.log(rrr);

  // 数组扁平化
  let rrrr = [[1,2,4,5],[7,8,9,6,0,[1,3,5,6]]].myReduce((prev,next)=>{
    return [...prev,...next]   // 仅能拉平一层   多层需要递归
  })

  console.log(rrrr);
}

// 2. forEach => myForEach  简单的循环
{
  [1,2,3].forEach((item,index,arr)=>{
    console.log(item,index,arr);
  })
  
  Array.prototype.myForEach = function(fn){
    for (let i = 0; i < this.length; i++) {
      fn(this[i],i,this)
    }
  };

  [1,2,3].myForEach((item,index,arr)=>{
    console.log(item,index,arr);
  })
}

// 3. map => myMap  返回一个新数组
{
  [1,2,3].map((item,index,arr)=>{
    return item*index
  })
  
  Array.prototype.myMap = function(fn){
    let arr = [];
    for (let i = 0; i < this.length; i++) {
      arr.push(fn(this[i],i,this));
    }
    return arr
  };

  let newM = [1,2,3].myMap((item,index,arr)=>{
    return item*index
  })
  console.log(newM);
}

// 4. filter   过滤，返回true表示留下，返回false 表示删除
{
  let f = [1,2,4].filter((item,index,arr)=>{
    return item > 2
  })
  console.log(f);
}

// 5. find   查找,返回查找元素， 找到后就不会再继续查找了，找不到返回undefined
{
  let f = [1,2,4].find((item,index,arr)=>{
    // return item === 2  // 2
    return item === 5  // undefined
  })
  console.log(f);
}

// 6. some   查找符合条件的元素，找到返回true 不会对空数组进行检测。不会改变原始数组。返回true后续不在继续执行
{
  let s = [1,2,4].some((item,index,arr)=>{
    return item % 2 === 0   // true
  })
  console.log(s);
}

// 7. every  用于检测数组所有元素是否都符合指定条件。不符合条件的，返回 false,后续不在继续执行
{
  let e = [1,2,4].every((item,index,arr)=>{
    return item % 2 === 0    
  })
  console.log(e);
}

// 8. includes  判断数组中是否存在 某个元素，存在返回true, 反之返回false
{
  console.log([1,2,4].includes(2));    // true
  console.log([1,2,4].includes(22));   // false
}

// 9. Array.from  可以将类数组转化为数组，常见的类数组有，function的参数列表，arguments,set ,htmlCollection 
{
  function a(){
    console.log(eval(Array.from(arguments).join('+')));
  }
  a(1,2,4,5)   // 12
}

// 10. Array.of() 和 Array 构造函数之间的区别在于,Array.of(7) 创建一个具有单个元素 7 的数组，Array(7) 创建一个长度为7的空数组（一个有7个空位(empty)的数组，而不是由7个undefined组成的数组）。
{
  console.log(Array.of(7));       // [7]
  console.log(Array.of(1, 2, 3)); // [1, 2, 3]
  
  console.log(Array(7));          // [  <7 empty items> ]
  console.log(Array(1, 2, 3));    // [1, 2, 3]
}

// 交集
{
  function  join(arr1,arr2){
    var arr3;
    arr3 = arr1.filter(function(num) {
        return arr2.indexOf(num) !== -1;
    });
    console.log(arr3); //输出[2, 3]
  }
  
  join([1,2,3,5], [2,3,6,8])
}