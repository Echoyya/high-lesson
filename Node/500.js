const cheerio = require('cheerio')
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const fs = require('fs');


// let part = `https://www.yqtxt.cc/html/24/24723/1469455.html`
// let tt = `https://www.yqtxt.cc`


// let part = `https://www.biquge.vip/78_78198/41427084.html`
// let tt = `https://www.biquge.vip`

// 惊华
/**
 *  let part = `https://amp.x52dus.com/nvpin/312335/1411.html`      
    let tt = `https://amp.x52dus.com/nvpin/312335/`
    var pp = 1412
    getPart(part)

  function getPart(part) {
    superagent.get(part)
      .charset('utf8')
      .buffer(true)
      .end(function (err, res) {
        let $ = cheerio.load(res.text);
        let title = $(".content .title").html()
        let cont = $("#BookText").html()
        let body = cont.replace(/&nbsp;/g, '').replace(/<br>/g, '').replace(/,content_num/g, '')
        let content = title + '\r\n' + body
        wss.write(content)
        pp = pp + 1
        console.log(title);
        getPart(tt + pp + '.html')
      })
  }
 */

// 欧阳
let part = `https://www.zjzfcj.com/book/1123/5080594.html`    
let tt = `https://www.zjzfcj.com`
// let part = `https://m.znlzd.com/bqg/697/5080589.html`    
// let tt = `https://m.znlzd.com`
getPart(part)
function getPart(part) {
  superagent.get(part)
    .charset('utf8')
    .buffer(true)
    .end(function (err, res) {
      let $ = cheerio.load(res.text);
      let title = $("h1.title").html();
      $(".content div").remove();
      $(".content script").remove();
      let cont = $(".content").html();
      let body = cont.replace(/&nbsp;/g, '').replace(/<br>/g, '').replace(/,content_num/g, '');
      let content = title + '\r\n' + body;
      wss.write(content);
      var pp = $(".section-opt.m-bottom-opt a").eq(2).attr('href').replace(/\n/g,'').replace(/\t/g,'');
      console.log(title);
      getPart(tt + pp);
    })
}
let wss = fs.createWriteStream('./600.txt')

// let part = `http://www.woplus.net/fangsiqi/429305_6.html`
// let tt = `http://www.woplus.net`
// getPart(part)
// function getPart(part) {
//   superagent.get(part)
//     .charset('utf8')
//     .buffer(true)
//     .end(function (err, res) {
//       console.log(res.text);
//       let $ = cheerio.load(res.text);
//       let title = $(".h1title").html()
//       let cont = $("#htmlContent").html()
//       let body = cont.replace(/&nbsp;/g, '').replace(/<br>/g, '').replace(/,content_num/g, '')
//       let content = title + '\r\n' + body
//       wss.write(content)
//       var pp = $(".chapter_Turnpage a").eq(3).attr('href') 
//       getPart(tt + pp)
//     })
// }

// let wss = fs.createWriteStream('./600.txt')


