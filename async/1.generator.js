// 回调函数的方式： callback setTimeout 会存在回调地狱的问题
// 而promise只是优化了一下，并没有完全解决
// generator 可以把函数的执行权交出去，  * + yield 
// async + await 取代，实际上也是基于generator的语法糖


// function* test() { // 生成器，它执行的结果叫迭代器
//   console.log(1);
//   yield 1;
//   console.log(2);
//   yield 2;
//   console.log(3);
//   yield 3;
// }

// let t = test() // 默认并没有执行
// t.next() // next  一步一步走
// t.next()
// t.next()


// 转义
let regeneratorRuntime = {
  mark(genFn){
    return genFn
  },
  wrap(iteratorFn) {
    const context = {
      next: 0,
      done: false, // 表示迭代器没有完成
      stop() {
        this.done = true
      }
    }

    let t = {}
    t.next = function (v) { // 用户调用的next方法
      let value = iteratorFn(context)
      context.sent = v
      return {
        value,
        done: context.done // 表示是否完成
      }
    }
    return t
  }
}

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(test);

function test() {
  return regeneratorRuntime.wrap(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return 1;

        case 2:
          a = _context.sent;
          console.log(a);
          _context.next = 6;
          return 2;

        case 6:
          b = _context.sent;
          console.log(b);
          _context.next = 10;
          return 3;

        case 10:
          c = _context.sent;
          console.log(c);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}


// function* test() { // 生成器，它执行的结果叫迭代器
//   let a = yield 1;
//   console.log(a);
//   let b = yield 2;
//   console.log(b);
//   let c = yield 3;
//   console.log(c);
// }

let t = test() // 默认并没有执行
t.next('as') // next  一步一步走   第一次传递参数是没有意义的
// 给next方法传递参数时， 会传给上一个yield的返回值
t.next('xc')
t.next('fsd')
t.next('1212')


let t2 = test()  
{
  let {value,done} = t2.next()   
  console.log(value,done);
}

{
  let {value,done} = t2.next()
  console.log(value,done);
}
{
  let {value,done} = t2.next()
  console.log(value,done);
}
{
  let {value,done} = t2.next()
  console.log(value,done);
}
