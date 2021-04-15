function fn1() {
  console.log(this, arguments);
}

function fn2() {
  console.log(this, arguments);
  return 1
}

function fn3() {
  console.log(this, arguments);
}

/**
 * call 的特点
 * 1. 可以改变当前函数this指向
 * 2. 还会让函数执行
 * 3. 每个函数都有call方法。属于原型上的方法
 * 
 */
{
  /**
   * 错误尝试
   * @param {*} context  上下文，需要被指向的this 
   * @returns  被调用方法的返回值，被调用方法没有返回值，则是undefined
   */
  Function.prototype.mCall = function (context) {
    context = context ? Object(context) : window
    context.fn = this
    let args = []
    for (let i = 1; i < arguments.length; i++) {
      args.push(arguments[i])
    }
    let r = context.fn(args) // call 方法接受到的就不在是一个一个的元素，而是一个数组，与原生实现不符
    delete context.fn;
    return r
  }

  // console.log(fn1.call('hello', 1, 2, 3));   // 原生
  // fn2.mCall.mCall.mCall(fn3, 1, 2, 3)  // this='hello' 错误语法， 利用xxx.fn2()时，this指向xxx原理 {}.fn = fn2

  // fn2.mCall(fn3, 1, 2, {'xx':'yy'})

  /**
   * 正确版本
   * @param {*} context  上下文，需要被指向的this 
   * @returns  被调用方法的返回值，被调用方法没有返回值，则是undefined
   * @tips args.push 拼接arguments[i],是为了使用 eval 去调用一个字符串，在方法被eval执行时，可以分别对应渠道arguments 值
   */
  Function.prototype.tCall = function (context) {
    context = context ? Object(context) : window
    context.fn = this
    let args = []
    for (let i = 1; i < arguments.length; i++) {
      args.push('arguments[' + i + ']')
    }
    // console.log(args.toString());   //  利用数组的toString() 方法 arguments[1],arguments[2],arguments[3]
    // let r = eval('context.fn(args )')    //  了解区别？
    let r = eval('context.fn(' + args + ')')
    delete context.fn;
    return r
  }

  // fn2.call(fn3, 1, 2, {'xx':'yy'})
  // console.log('--------------------------------------------------------------------');
  fn2.tCall(fn3, 1, 2, {'xx':'yy'})
  fn2.tCall.tCall.tCall(fn3, 1, 2, 3)  // this='hello' 错误语法， 利用xxx.fn2()时，this指向xxx原理 {}.fn = fn2
  // 如果多个call会让call方法执行，并且把call中this改变成fn3
  // console.log('--------------------------------------------------------------------');
  // fn2.mCall(fn3, 1, 2, {'xx':'yy'})
  // --------------------------------------------------------------------
}

/**
 *  apply 的特点
 *  1. 可以改变当前函数this指向
 *  2. 还会让函数执行
 *  3. 每个函数都有apply方法。属于原型上的方法
 */

{
  Function.prototype.mApply = function (context, args) {
    context = context ? Object(context) : window
    context.fn = this
    if (!args) return context.fn();
    let r = eval('context.fn(' + args + ')'); // 不支持对象，字符串
    // let r = context.fn(args);   // 可以实现 传递对象和字符串，但是接受的方法中接受到的参数 是一个数组，与原生不符，需要将参数展开，分别传入
    // let r = context.fn(...args);
    delete context.fn;
    return r;
  }
  // fn2.apply(fn3, [1, 2])
  // console.log('--------------------------------------------------------------------');
  // fn2.mApply(fn3, [1, 2])

  // fn2.apply(fn3, [1, 2, {'xx': 'yy'}])
  // console.log('--------------------------------------------------------------------');
  // fn2.mApply(fn3, [1, 2, {'xx': 'yy'}])
}