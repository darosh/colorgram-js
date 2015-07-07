var assert = require('assert');
var load = require('./lib/load_image');
var colorgram = require('../dist/colorgram');

describe('Colorgram module', function(){
    it('should extract 12 colors', function(done) {
        load('./test/images/pastel.png', function(img){
			var colors = colorgram.extract(img, 12);
			assert.equal(colors.length, 12);
            done();
        });
    });
});
