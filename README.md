# Colorgram

TypeScript color extraction library. In TypeScript/JavaScript. For browser/server.

## Demo

https://cdn.rawgit.com/darosh/colorgram-js/master/test/bowser_test.html

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
- https://github.com/igor-bezkrovny/image-quantization
- http://members.ozemail.com.au/~dekker/NEUQUANT.HTML
- https://pngquant.org/
- https://color.adobe.com/create/image/

## TypeScript documentation

https://cdn.rawgit.com/darosh/colorgram-js/master/doc/index.html
