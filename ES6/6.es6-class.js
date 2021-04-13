class Parent{
  // constructor(name='yya'){
    // this.name = name   
    // return {}
  // }
  name = 'yys'
  static b(){   // 静态方法，属于类上的方法，通过类调用
    console.log('static b');
  }
  eat(){
    console.log('eating');
  }
}

class Child extends Parent{
  constructor(age,name){
    super(name)  // Parent.call(this)
    this.age = age   // 私有属性
  }
  smoking(){
    console.log('smoking');  // 原型上的方法
  }
  getAge(){
    console.log(this.age);   
  }
  static a(){   // 静态方法，属于类上的方法，通过类调用
    console.log('static a');
  }
}

let p1 = new Parent()
console.log(p1.name);
console.log('---------------------------------------');

let c1 = new Child(9,'yya')
// c1.getAge()
// Child.a()  // 通过类调用

// 继承
// console.log(c1.name);
// c1.eat()
Child.b()  


// 1. 类只能new
// 2. 类可以继承，公有，私有，和静态方法
// 3. 如果父类的构造函数中，返回了一个引用空间，就会作为子类的 this返回
