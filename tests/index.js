
var request = require('supertest')
var app = require('../app')

// Test index.html
describe('Test index.html page', function () {
  it('GET / should return html', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect('X-Powered-By', 'Express')
      .end(function (err, res) {
        if (err) return done(err) // if response is 500 or 404 & err, test case will fail
        done()
      })
  })
})
