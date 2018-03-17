
/**
 * Express Feeds Routes
 * @module Routes/feeds
 * @requires express
 * @requires models
 */
var express = require('express')
var router = express.Router()

var Models = require('../models/models')
var Feeds = Models.feeds

var scraper = require('../services/scraper')({
  model: Feeds
})

/**
 * Get list of existing feeds
 * @method GET
 * @return {Array} List of feeds
 */
router.get('/', function (req, res, next) {
  Feeds
    .find()
    .exec(function (err, feedsFound) {
      if (err) return res.status(400).send(err.toString())
      res.send(feedsFound)
    })
})

/**
 * Create new feed
 * @method POST
 * @return {Object} Created feed
 */
router.post('/', function (req, res, next) {
  Feeds
    .create(req.body, function (err, feedsCreated) {
      if (err) return res.status(400).send(err.toString())
      res.status(201).send(feedsCreated)
    })
})

/**
 * Get feed from today
 * Use database as primary data source and newspaper as secondary data source
 * @method GET/today
 * @return {Array} Feeds found
 */
router.get('/today', function (req, res, next) {
  // new Date(year, month, day, hours, minutes, seconds, milliseconds)
  var now = new Date()
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

  Feeds
    .find({createdAt: { $gt: today, $lt: tomorrow }})
    .exec(function (err, feedsFound) {
      if (err) return res.status(400).send(err.toString())
      if (feedsFound.length) {
        res.send(feedsFound)
      } else {
        var options = { save: true }
        if (req.query.save === 'false') {
          options.save = false
        }
        scraper.readFeeds(null, options)
          .then(function (feedsRead) {
            res.send(feedsRead)
          })
          .catch(function (err) {
            res.status(400).send(err)
          })
      }
    })
})

/**
 * Get specific feed
 * @method GET/:Id
 * @return {Object} Feed found
 */
router.get('/:feedId', function (req, res, next) {
  Feeds
    .findById(req.params.feedId)
    .exec(function (err, feedFound) {
      if (err) return res.status(400).send(err.toString())
      res.send(feedFound)
    })
})

/**
 * Update feed
 * @method PUT/:Id
 * @return {Object} Feed updated
 */
router.put('/:feedId', function (req, res, next) {
  Feeds
    .findByIdAndUpdate(req.params.feedId, req.body)
    .exec(function (err, feedUpdated) {
      if (err) return res.status(400).send(err.toString())
      res.status(202).send(feedUpdated)
    })
})

/**
 * Delete feed
 * @method DELETE/:Id
 * @return {Object} Feed deleted
 */
router.delete('/:feedId', function (req, res, next) {
  Feeds
    .findByIdAndRemove(req.params.feedId)
    .exec(function (err, feedDeleted) {
      if (err) return res.status(400).send(err.toString())
      res.send(feedDeleted)
    })
})

module.exports = router
