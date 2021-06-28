// crypto 是node中提供好的用于加密的包，各种 摘要算法 和 加密算法

// MD5 算法 hash算法 或者是摘要算法（MD5 无法反解）
/**
 * MD5 特点：
 * 1. 不能反解，不可逆，
 * 2. 相同的内容，摘要出的结果相同
 * 3. 不同的内容，摘要出长度是相同的
 * 4. 不同的内容，摘要的结果完全不同 (雪崩效应，有一点不一样，结果就完全不一样)
 * 5. 撞库不叫解密，为了安全，可以将一个md5值多次加密，一般三次以上就无法破解了md5(md5(md5(xxx))),目前这种算法使用较少，常用加盐算法

 */

const crypto = require('crypto');
//                                    摘要的内容     摘要的格式
let r1 = crypto.createHash('md5').update('abcd').digest('base64');
//                                   分开摘要， 如果内部使用了流，可以读一点摘要一点
let r2 = crypto.createHash('md5').update('a').update('b').update('cd').digest('base64');
// console.log(r1, r2);
// 加密算法： 能解密 的才叫加密算法
/**
 * 盐值：秘钥
 */
 const crypto = require('crypto');

 let r3 = crypto.createHmac('sha256','n').update('a').update('b').update('cd').digest('base64');
 let r4 = crypto.createHmac('sha256','h').update('a').update('b').update('cd').digest('base64');
console.log(r3);
console.log(r4);

