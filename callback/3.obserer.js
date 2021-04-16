// 观察者模式，有观察者肯定有被观察者
// 观察者需要放到被观察者中，呗观察者的状态发生变化，需要通知观察者

// 内部也是基于发布订阅模式，收集观察者，状态变化后要通知观察者

// vue2中:可以说是观察者模式，因为存在 数据变化，更新视图
// vue3中没有class

// 也可以说是发布订阅模式：

class Subject{
  constructor(name){
    this.name = name
    this.state = 'happy'
    this.obserers = []
  }
  attach(o){   // 被观察者 进行收集
    this.obserers.push(o)
  }
  // set state(val){
  //   console.log(val);
  // }
  setState(newState){
    this.state = newState
    this.obserers.forEach(o=>o.watching(this))
  }
}
class Parent{
  constructor(name){
    this.name = name
  }
  watching(subject){
    console.log(`${this.name}监听到了${subject.name}的state发生改变，现在是${subject.state}`);
  }
}

let baby = new Subject('baby')
let father = new Parent('father')
let mother = new Parent('mother')

baby.attach(father)
baby.attach(mother)
baby.setState('crying') 