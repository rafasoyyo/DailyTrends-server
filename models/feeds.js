/**
 * Mongoose Model to manage feeds
 * @module Models/Feeds
 * @requires mongoose
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/** Schema to define feeds */
var feedSchema = new Schema({
  title: { type: String },
  body: { type: String },
  source: { type: String },
  publisher: { type: String },
  image: { type: String }
}, { timestamps: true })

/** Feeds model from feedSchema */
var feedModel = mongoose.model('feeds', feedSchema)

module.exports = feedModel
