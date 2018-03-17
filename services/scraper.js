
/**
 * Feed Scraper
 * @module Services/scraper
 * @requires async
 * @requires cheerio
 * @requires request
 * @requires universalify
 */
var async = require('async')
var cheerio = require('cheerio')
var request = require('superagent')
var universalify = require('universalify')

/**
 * Feeds managements
 * @method feeds
 * @return {Object} List of methods
 */
module.exports = function (options) {
  /** Custom sources */
  var custom = []

  /** Model to save feeds */
  var model = null

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
   * Set feeds sources
   * @method feeds:set
   * @return {Array} List of feeds sources
   */
  var setSources = function (items) {
    if (!Array.isArray(items)) {
      items = [items]
    }
    custom = custom.concat(items)
    return getSources()
  }

  /**
   * Get feeds sources
   * @method feeds:getSources
   * @return {Array} List of feeds sources
   */
  var getSources = function () { return sources.concat(custom) }

  /**
   * Save feeds content
   * @method feeds:saveFeeds
   * @return {Promise} Multiple save promises
   */
  var saveFeeds = function (feeds) {
    if (!model) {
      throw new Error('No database model has been defined!')
    }
    var savePromises = []
    feeds.forEach(function (feed) {
      savePromises.push(model.create(feed))
    })
    return Promise.all(savePromises)
  }

  /**
   * Read feeds content from source
   * @method feeds:read
   * @return {function} Node callback { error, response}
   */
  var readFeeds = function (sources, options, callback) {
    callback = arguments[arguments.length - 1]
    options = typeof arguments[1] === 'object' ? arguments[1] : {}
    if (arguments[0] && typeof arguments[0] !== 'function') {
      sources = Array.isArray(sources) ? sources : [sources]
    } else {
      sources = getSources()
    }

    var defaults = { save: true }
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
        saveFeeds(response)
      }
      callback(err, response)
    })
  }

  if (options.sources) {
    setSources(options.sources)
  }

  if (options.model) {
    model = options.model
  }

  return {
    readFeeds: universalify.fromCallback(readFeeds),
    setSources: universalify.fromCallback(setSources)
  }
}
