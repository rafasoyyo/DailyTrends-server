/* global it, describe */

var request = require('supertest')
var app = require('../app')

// Test index.html
describe('Test feeds Routes', function () {
  it('GET - should return array of feeds', function (done) {
    request(app)
      .get('/feeds')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('X-Powered-By', 'Express')
      .expect(Array.isArray)
      .end(function (err, res) {
        if (err) return done(err) // if response is 500 or 404 & err, test case will fail
        done()
      })
  })

  it('POST - should create a feeds', function (done) {
    request(app)
      .post('/feeds')
      .expect(201)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('X-Powered-By', 'Express')
      .expect(Object.is)
      .end(function (err, res) {
        if (err) return done(err) // if response is 500 or 404 & err, test case will fail
        done()

        describe('Test feed element Routes', function () {
          it('GET - should return last feed created', function (done) {
            request(app)
              .get('/feeds/' + res.body._id)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect('X-Powered-By', 'Express')
              .expect(Object.is)
              .end(function (err, res) {
                if (err) return done(err) // if response is 500 or 404 & err, test case will fail
                done()
              })
          })

          it('PUT - should Update last feed created', function (done) {
            request(app)
              .put('/feeds/' + res.body._id)
              .expect(202)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect('X-Powered-By', 'Express')
              .expect(Object.is)
              .end(function (err, res) {
                if (err) return done(err) // if response is 500 or 404 & err, test case will fail
                done()
              })
          })

          it('Delete - should remove last feed created', function (done) {
            request(app)
              .delete('/feeds/' + res.body._id)
              .expect(200)
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect('X-Powered-By', 'Express')
              .expect(Object.is)
              .end(function (err, res) {
                if (err) return done(err) // if response is 500 or 404 & err, test case will fail
                done()
              })
          })
        })
      })
  })
})
