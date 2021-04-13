let name1 = { name: 'yya' }
let age = { age: 18 }
let obj = Object.assign(name1,age)   // 等同于下面写法，
// console.log(obj);
console.log({...name1,...age});

console.log('----------------------------------');

let obj1 = { name: 'yya' }
let obj2 = { age: 18 }

// obj1.__proto__ = obj2
Object.setPrototypeOf(obj1,obj2)
console.log(Object.getPrototypeOf(obj1));

console.log(obj1.age);

console.log('----------------------------------');

let obj3 = { name: 'Echo',age:20 }
let obj4 = { 
  name: 'yya', 
  getFatherName(){
    // return this.name   // yya
    return super.name  // Echo  可以通过super 关键字获取父属性

  },
  __proto__ :obj3
}

console.log(obj4.age);
console.log(obj4.getFatherName());