
/**
 * Express Routes
 * @module Routes
 */

/**
 * Express Index Routes
 * @module Routes/
 * @requires express
 */

var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

module.exports = router
