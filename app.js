var express = require('express')
var path = require('path')
// var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

var app = express()

/**
 * Get config
 */
var env = (process.env.NODE_ENV || 'development').trim()
var config = require('./config')[env]

/**
 * Create database connection
 */
mongoose.connect(config.mongoDB)
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (res) { console.log('Mongoose database running: ' + config.mongoDB) })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/** CORS manipulation */
var allowedOrigins = ['http://localhost:3000', 'http://localhost:4200']
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  let origin = req.headers.origin
  if (allowedOrigins.indexOf(origin) >= 0) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  if (req.method === 'OPTIONS') {
    res.status(200).end()
  } else {
    next()
  }
})

app.use('/', require('./routes/index'))
app.use('/api/feeds', require('./routes/feeds'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
