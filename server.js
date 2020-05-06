const express = require('express')

app = express()
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views/')
app.use(express.static('public'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`))

app.get('/', function(req, res) {
    res.redirect('/home')
})

app.get('/home', function(req, res) {
    res.render('pages/index')
})

app.get('/getting_started', function(req, res) {
    res.render('pages/getting_started')
})

app.get('/features', function(req, res) {
    res.render('pages/features')
})

app.get('/people', function(req, res) {
    res.render('pages/people')
})

app.get('/publications', function(req, res) {
    res.render('pages/publications')
})

app.get('/sponsors', function(req, res) {
    res.render('pages/sponsors')
})

app.get('/demo', function(req, res) {
    res.render('pages/demo')
})

app.get('*', function(req, res) {
    res.render('pages/404')
})