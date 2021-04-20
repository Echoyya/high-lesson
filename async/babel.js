
// 转义

function test() {
  return regeneratorRuntime.wrap(function test$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 生成器，它执行的结果叫迭代器
          console.log(1);
          _context.next = 3;
          return 1;

        case 3:
          console.log(2);
          _context.next = 6;
          return 2;

        case 6:
          console.log(3);
          _context.next = 9;
          return 3;

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}



var _marked = /*#__PURE__*/regeneratorRuntime.mark(test);

function test() {
  var a, b, c;
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