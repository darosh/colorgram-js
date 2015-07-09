# Colorgram [![Build Status](https://travis-ci.org/darosh/colorgram-js.svg)](https://travis-ci.org/darosh/colorgram-js)

Color extraction library. In TypeScript/JavaScript. For browser/server.

## Demo

[test/browser_test.html](http://darosh.github.io/colorgram-js/test/browser_test.html)

## Features

- small size, 1kB (minified + gzipped)
- pretty fast, 512&times;512 pixels in ~50ms, 340&times;340 pixels in ~15ms (~6&times; slower on mobile)
- scans every pixel
- identical output for rotated images
- sampled by top 2 bits of 6 groups: R, G, B, H, L, and [luminance](https://en.wikipedia.org/wiki/Luma_%28video%29#Use_of_luminance)
- calculates average per group
- fixed memory footprint, samples using 2 (bits) ^ 6 (groups) * 4 (RGB + count) * 4 (Uint32) = 65536 bytes
- usually generates small (~16 colors) palette of main colors
- supports RGB and RGBA input pixel array (compatible with [ImageData.data](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/data))
- using [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)
- no native dependencies

## Similar stuff

- [lokesh/color-thief](https://github.com/lokesh/color-thief)
- [leeoniya/RgbQuant.js](https://github.com/leeoniya/RgbQuant.js)
- [nrabinowitz/quantize.js](https://gist.github.com/nrabinowitz/1104622)
- [igor-bezkrovny/image-quantization](https://github.com/igor-bezkrovny/image-quantization)
- [NeuQuant](http://members.ozemail.com.au/~dekker/NEUQUANT.HTML)
- [quantization keyword in npm](https://www.npmjs.com/browse/keyword/quantization)
- [pngquant](https://pngquant.org/)
- [Adobe Color CC](https://color.adobe.com/create/image/)

## Install

```npm install colorgram```

## Usage

See [test](https://github.com/darosh/colorgram-js/tree/master/test) folder.

## TypeScript documentation

[http://darosh.github.io/colorgram-js/doc/](http://darosh.github.io/colorgram-js/doc/)

## License

[MIT](https://github.com/darosh/colorgram-js/tree/master/LICENSE)
