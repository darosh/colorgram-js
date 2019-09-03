var assert = require('assert')
var load = require('./lib/load_image')
var colorgram = require('../dist/colorgram')

describe('Colorgram', function () {
  it('should extract 12 colors', function (done) {
    load('./test/images/pastel.png', function (img) {
      var colors = colorgram.extract(img, 12)
      assert.equal(colors.length, 12)
      done()
    })
  })

  it('should extract yellow color', function (done) {
    load('./test/images/stone.png', function (img) {
      var colors = colorgram.extract(img, 1)
      assert.deepEqual(colors[0], [254, 245, 159, 1])
      done()
    })
  })

  it('should consume only 1kB', function (done) {
    load('./test/images/pastel.png', function (img) {
      var sample = colorgram.sample(img)
      assert.equal(sample.length * 4, 1024)
      done()
    })
  })
})
