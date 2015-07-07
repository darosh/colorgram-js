'use strict';

var fs = require('fs');
var PNG = require('pngjs').PNG;

module.exports = function (filePath, done) {
	fs.createReadStream(filePath)
		.pipe(new PNG())
		.on('parsed', function () {
			done({
				data: this.data,
				width: this.width,
				height: this.height,
				channels: 4
			});
		});
};
