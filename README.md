# Colorgram [![Build Status](https://travis-ci.org/darosh/colorgram-js.svg)](https://travis-ci.org/darosh/colorgram-js)

TypeScript color extraction library. In TypeScript/JavaScript. For browser/server.

## Demo

[test/browser_test.html](https://cdn.rawgit.com/darosh/colorgram-js/ff4c279c8ca76ca3497a58e55ea173e70d76c88c/test/browser_test.html)

## Features

- small size, 1kB (minified + gzipped)
- pretty fast, 512&times;512 pixels in ~50ms, 340&times;340 pixels in ~15ms
- scans every pixel
- identical output for rotated images
- sampled by top 2 bites of 6 group R, G, B, H, L, [luminance](https://en.wikipedia.org/wiki/Luma_%28video%29#Use_of_luminance)
- calculates average per group
- fixed memory footprint, samples using 2 ^ 6 * 4 = 16384 bytes

## Similar stuff

- https://github.com/lokesh/color-thief
- https://github.com/leeoniya/RgbQuant.js
- https://gist.github.com/nrabinowitz/1104622
- https://github.com/igor-bezkrovny/image-quantization
- http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
- https://pngquant.org/
- https://color.adobe.com/create/image/

## TypeScript documentation

https://rawgit.com/darosh/colorgram-js/master/doc/index.html
