
/**
 * Feed Scraper
 * @module Services/scraper
 * @requires cheerio
 * @requires request
 * @requires async
 */
var cheerio = require('cheerio')
var request = require('superagent')
var async = require('async')

var Feeds = require('../models/models').feed

/**
 * Feeds managements
 * @method feeds
 * @return {Object} List of methods
 */
var feeds = function () {
  /** Custom sources */
  var custom = []
  /**
   * Default sources
   * @Todo Generate detailed example
   */
  var sources = [
    {
      url: { value: 'https://elpais.com/' },
      main: { value: 'article' },
      headers: { value: {'Content-Type': 'text/html; charset=UTF-8'} },
      source: { type: 'string', value: 'El País' },
      title: { type: 'text', value: '.articulo-titulo' },
      body: { type: 'text', value: '.articulo-entradilla' },
      publisher: { type: 'text', value: '.autor-nombre a' },
      image: { type: 'custom', value: 'figure.foto meta[itemprop="url"]', prop: 'content' }
    },
    {
      url: { value: 'http://www.elmundo.es/' },
      main: { value: 'article' },
      headers: { value: {'Content-Type': 'text/html; charset=iso-8859-15'} },
      source: { type: 'string', value: 'El Mundo' },
      title: { type: 'text', value: '.mod-title' },
      body: { type: 'text', value: '.entradilla' },
      publisher: { type: 'text', value: '.mod-author' },
      image: { type: 'custom', value: '.image-item img', prop: 'src' }
    }
  ]

  /**
   * Get feeds sources
   * @method feeds:get
   * @return {Array} List of feeds sources
   */
  this.get = function () { return sources.concat(custom) }

  /**
   * Set feeds sources
   * @method feeds:set
   * @return {Array} List of feeds sources
   */
  this.set = function (items) {
    if (!Array.isArray(items)) {
      items = [items]
    }
    custom = custom.concat(items)
    return this.get()
  }

  /**
   * Save feeds content
   * @method feeds:save
   * @return {Promise} Multiple save promises
   */
  this.save = function (feeds) {
    var savePromises = []
    feeds.forEach(function (feed) {
      savePromises.push(Feeds.create(feed))
    })
    return Promise.all(savePromises)
  }

  /**
   * Read feeds content from source
   * @method feeds:read
   * @return {function} Node callback { error, response}
   */
  this.read = function (sources, options, callback) {
    callback = arguments[arguments.length - 1]
    options = typeof arguments[1] === 'object' ? arguments[1] : {}

    if (arguments[0] && typeof arguments[0] !== 'function') {
      sources = Array.isArray(sources) ? sources : [sources]
    } else {
      sources = this.get()
    }

    var defaults = { save: false }
    var opt = Object.assign(defaults, options)

    async.concat(sources, function (source, sourcecb) {
      request
        .get(source.url.value)
        .set(source.headers.value)
        .then(function (res) {
          var results = []
          var result = {}
          var error = null
          var val
          try {
            var $ = cheerio.load(res.text)
            $(source.main.value).each(function (index, element) {
              result = {}
              Object.keys(source).forEach(function (key) {
                val = source[key]
                switch (val.type) {
                  case 'string':
                    result[key] = val.value
                    break
                  case 'text':
                    result[key] = $(element).find(val.value).text()
                    break
                  case 'custom':
                    result[key] = $(element).find(val.value).prop(val.prop)
                    break
                }
              })
              results.push(result)
            })
          } catch (e) {
            error = e
          } finally {
            sourcecb(error, results)
          }
        })
        .catch(sourcecb)
    }, function (err, response) {
      if (opt.save) {
        this.saveFeeds(response)
      }
      // console.log('response -> ', response)
      callback(err, response)
    })
  }
  return this
}

module.exports = require('universalify').fromCallback(feeds().read)
