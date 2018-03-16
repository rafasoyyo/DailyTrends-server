
/**
 * Run all tests tasks
 * @module Tests
 * @requires fs
 */

/**
 * Require and run all tests files
 * @method runTests
 * @return {Object} Report from console
 */
var runTests = function () {
  require('fs').readdirSync(__dirname).forEach(function (file) {
    if (file.match(/\.js$/) !== null && file !== 'test.js') {
      var name = file.replace('.js', '')
      exports[name] = require('./' + file)
    }
  })
}

module.exports = runTests()
