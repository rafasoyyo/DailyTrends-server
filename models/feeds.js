/**
 * Mongoose Model to manage feeds
 * @module Models/Feeds
 * @requires mongoose
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/** Schema to define feeds */
var feedSchema = new Schema({
  title: { type: String, default: 'undefined' },
  body: {type: String, default: 'undefined'},
  source: { type: String, default: 'undefined' },
  publisher: { type: String, default: 'undefined' },
  image: { type: String }
})

/** Feeds model from feedSchema */
var feedModel = mongoose.model('feeds', feedSchema)

module.exports = feedModel
