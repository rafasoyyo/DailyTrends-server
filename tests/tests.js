
/**
 * Run all testins tasks
 * @module Tests
 */

require('fs').readdirSync(__dirname).forEach(function (file) {
  if (file.match(/\.js$/) !== null && file !== 'test.js') {
    var name = file.replace('.js', '')
    exports[name] = require('./' + file)
  }
})
