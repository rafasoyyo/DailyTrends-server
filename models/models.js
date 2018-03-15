
/**
 * Require all Modules
 * @module Models
 * @requires fs
 */

/**
 * Require all Model from folder and name it as file names
 * @method getModels
 * @return {Object} All existing mongoose models
 */
var getModels = function () {
  var models = {}
  require('fs').readdirSync(__dirname).forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'models.js') {
      var name = file.replace('.js', '')
      models[name] = require('./' + file)
    }
  })
  return models
}

module.exports = getModels()
