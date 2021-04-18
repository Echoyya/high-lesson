function one() {
    var a = 1

    function two() {
        var b = 2

        function three() {
            var c = 3
            debugger
            console.log(a, b, c,two);
        }
        three()
    }
    two()
}

one()

// 当函数运行时，会创建一个执行环境，这个执行环境就叫执行上下文(是一个对象 )，execution Context 
// 执行上下文中会创建一个对象 叫做变量对象，value object (vo) ，vo是执行上下文中的一个属性
// 基础数据类型都保存在变量对象中
// 引用数据类型的值，保存在堆中，通过操作对象的引用地址来操作对象