# Colorgram [![Build Status](https://travis-ci.org/darosh/colorgram-js.svg)](https://travis-ci.org/darosh/colorgram-js)

Color extraction library. In TypeScript/JavaScript. For browser/server.

## Demo

[test/browser_test.html](https://cdn.rawgit.com/darosh/colorgram-js/acc33d267a2a0f6074663e64b6adfb86c9cc5a8d/test/browser_test.html)

## Features

- small size, 1kB (minified + gzipped)
- pretty fast, 512&times;512 pixels in ~50ms, 340&times;340 pixels in ~15ms
- scans every pixel
- identical output for rotated images
- sampled by top 2 bites of 6 group R, G, B, H, L, [luminance](https://en.wikipedia.org/wiki/Luma_%28video%29#Use_of_luminance)
- calculates average per group
- fixed memory footprint, samples using 2 ^ 6 * 4 = 16384 bytes

## Similar stuff

- [lokesh/color-thief](https://github.com/lokesh/color-thief)
- [leeoniya/RgbQuant.js](https://github.com/leeoniya/RgbQuant.js)
- [nrabinowitz/quantize.js](https://gist.github.com/nrabinowitz/1104622)
- [igor-bezkrovny/image-quantization](https://github.com/igor-bezkrovny/image-quantization)
- [NeuQuant](http://members.ozemail.com.au/~dekker/NEUQUANT.HTML)
- [pngquant](https://pngquant.org/)
- [Adobe Color CC](https://color.adobe.com/create/image/)

## TypeScript documentation

[doc/index.html](https://rawgit.com/darosh/colorgram-js/master/doc/index.html)

## Install

```npm install colorgram```

