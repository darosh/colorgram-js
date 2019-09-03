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

  it('should extract pastel color', function (done) {
    load('./test/images/pastel.png', function (img) {
      var colors = colorgram.extract(img, 1)
      assert.deepEqual(colors[0], [220, 69, 86, 1])
      done()
    })
  })

  it('should consume only 64kB', function (done) {
    load('./test/images/pastel.png', function (img) {
      var sample = colorgram.sample(img)
      assert.equal(sample.length, 65536 / 4)
      done()
    })
  })

  it('should get sample', function (done) {
    load('./test/images/pastel.png', function (img) {
      var sample = colorgram.sample(img)
      assert.equal(sample[1], 1)
      done()
    })
  })

  it('should do the math :-)', function () {
    const t0 = 0b00000000
    const t1 = 0b01000000
    const t2 = 0b10000000
    const t3 = 0b11000000

    assert.equal(t0 << 2, 0)
    assert.equal(t1 << 2, 0b0100000000)
    assert.equal(t2 << 2, 0b1000000000)
    assert.equal(t3 << 2, 0b1100000000)

    assert.equal(t0 << -2, 0)
    assert.equal(t1 << -2, 0)
    assert.equal(t2 << -2, 0)
    assert.equal(t3 << -2, 0)

    assert.equal(0b11000000 >> 2, 0b00110000)
    assert.equal(0b11000000 >> 4, 0b00001100)
    assert.equal(0b11000000 >> 6, 0b00000011)
  })
})
