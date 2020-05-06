const express = require('express')

app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.use(express.static('public'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

app.get('/', function(req, res) {
    res.render('pages/index')
})