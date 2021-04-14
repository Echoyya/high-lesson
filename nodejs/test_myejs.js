let obj = {
  arr: [1, 2, 3, 4]
}

function a(obj) {
  let str = ''
  with(obj) { // with 语法，以谁为上下文 obj
    str = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>`
    arr.forEach(item => {
      str += `<li>1</li>`
    })
    str += `</body>
  </html>`
  }
}


console.log(str);


function anonymous(obj) {
  let str = ""
  with(obj) {
    str += `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
      </head>
      <body>`
    arr.forEach(item => {
      str += `<li>1</li>`
    })
    str += `</body></html>`
  }
  return str
}
anonymous(obj)