// code runner npm install -g ts-node
/**
 * 栈：先进后出，函数执行完，先从栈顶弹出
 */
class Stack {
  private items: number[] = []
  push(ele: number) {
    this.items.push(ele)
  }
  pop(): number {
    return this.items.pop()
  }
}

let stack = new Stack()
stack.push(1)
stack.push(2)
stack.push(3)
console.log(stack.pop())
console.log(stack.pop())
console.log(stack.pop())


/**
 * 队列：先进先出
 */
 class Queue {
  private items: number[] = []
  enqueue(ele: number) {
    this.items.push(ele)
  }
  dequeue(): number {
    return this.items.shift()
  }
  print(){
    console.log(this.items.toString());
    
  }
}
let queue = new Queue()
queue.enqueue(1)
queue.print()

queue.enqueue(2)
queue.print()

queue.enqueue(3)
queue.print()

queue.dequeue()
queue.print()

queue.dequeue()
queue.print()

queue.dequeue()
queue.print()