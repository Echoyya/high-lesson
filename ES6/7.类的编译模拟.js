/**
 * 1. 类的调用检测
 * 2. 属性描述器
 * 3. 子类继承
 */

// 类的调用检测，检测实例 是不是new 出来的
function _classCallCheck(instance, constructor) {
  if (!(instance instanceof constructor)) {
    throw new TypeError('Class constructor Parent cannot be invoked without \'new\'')
  }
}

// constructor 构造函数
// protoProperties 是原型方法的描述
// staticProperties 是静态方法的描述
function _defineProperties(target, fnArr) {
  for (let i = 0; i < fnArr.length; i++) {
    Object.defineProperty(target, fnArr[i].key, {
      // value:fnArr[i].value,
      ...fnArr[i],
      configurable: true,
      enumerable: true,
      writable: true
    })
  }
}

function _createClass(constructor, protoProperties, staticProperties) {
  if (protoProperties.length > 0) {
    _defineProperties(constructor.prototype, protoProperties)
  }
  if (staticProperties.length > 0) {
    _defineProperties(constructor, staticProperties)
  }

}
var Parent = function Parent() {
  
  function P() {
    // 检测原理：如果this是window，说明就是直接调用，如果this是P的实例，就说明是通过new 调用的
    _classCallCheck(this, P)
    this.name = 'parent'
    // return {}
  }
  // 给类添加公有方法 及静态方法
  _createClass(P, [{ // 属性描述器
    key: 'eat',
    value: function () {
      console.log('eating');
    }
  }], [{
    key: 'b',
    value: function () {
      return 'b'
    }
  }]);
  return P
}()


function _inherits(subClass, superClass) {
  // 继承公有属性
  subClass.prototype.__proto__ = superClass.prototype
  // 继承静态方法
  Object.setPrototypeOf(subClass,superClass)
}


let Child = (function (Parent) {
  // 先实现继承父类的公有属性 和静态方法
  _inherits(C, Parent)
  function C(age) {
    _classCallCheck(this, C)
    let obj = Parent.call(this)
    let _this = this
    if(typeof obj === 'object') { // 解决了 父类返回了一个引用类型的问题
      _this = obj
    } 
    _this.age = age
    return _this
  }
  // 给类添加公有方法 及静态方法
  _createClass(C, [{ // 属性描述器
    key: 'smoking',
    value: function () {
      console.log('smoking');
    }
  }], [{
    key: 'a',
    value: function () {
      return 'a'
    }
  }]);
  return C
})(Parent)


let p = new Parent()
console.log(p);
// p.eat()
// console.log(Parent.b());

let c = new Child(9)
// console.log(c);
// console.log(c.name);
// c.eat()
// console.log(Child.b());