let express = require('express')
let app = express()
app.use(express.static(__dirname))

app.get('/clock',function(req,res){
 setInterval(() => {
   res.write(`
    <script>
      parent.setTime('${new Date().toLocaleString()}')
    </script>
   `)
 }, 1000);
})

app.listen(3000)