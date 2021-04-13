{
  let mName = "echoyya";
  let age = "18";

  let str = `${mName}今年${age}岁了`
  let str2 = '${mName}今年${age}岁了'
  // /\$\{(.+?)\}/g

  // /\$\{([^}]*)\}/g
  let tStr2 = str2.replace(/\$\{([^}]*)\}/g, function () {
    return eval(arguments[1])
  })
  console.log(str);
  console.log(tStr2);
}


/**
 * 带标签的模板字符，自定义模板字符串的实现
 */
{
  let mName = "echoyya";
  let age = "18";
  let str = format `${mName}今年${age}岁了`

  function format() {
    // console.log(arguments);  // 第一个参数 是字符串的数组，第二个参数是第一个变量表达式 的值
    let str = ''
    let strings = arguments[0]
    let values = [].slice.call(arguments, 1)
    for (let i = 0; i < values.length; i++) {
      str += `${strings[i]}*${values[i]}*`
    }
    str += strings[strings.length - 1]
    return str
  }
  console.log(str);
}

