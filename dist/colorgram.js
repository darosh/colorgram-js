(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Colorgram = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Colorgram;
(function (Colorgram) {
    'use strict';
    /**
     * RGB = 3, RGBAlpha = 4
     * TODO: Alpha not calculated
     * TODO: Grey not supported
     */
    (function (Channels) {
        // Grey = 1,
        // GreyAlpha = 2,
        Channels[Channels["RGB"] = 3] = "RGB";
        Channels[Channels["RGBAlpha"] = 4] = "RGBAlpha";
    })(Colorgram.Channels || (Colorgram.Channels = {}));
    var Channels = Colorgram.Channels;
    function extract(img, top) {
        if (top === void 0) { top = 12; }
        var samples = sample(img);
        var used = pickUsed(samples, samples.length / 4);
        sortUsed(used);
        // TODO: Random idea: group similar by HSL (or HUSL?) distance
        return getColorStats(samples, used, top);
    }
    Colorgram.extract = extract;
    function sample(img) {
        var topBits = 2;
        var lowBits = 8 - topBits;
        /* tslint:disable:no-bitwise */
        var sides = 1 << topBits;
        /* tslint:enable:no-bitwise */
        // Skipping S from HSL
        // var shiftS:number = -lowBits + 6 * topBits;
        var shiftM = -lowBits + 5 * topBits;
        var shiftH = -lowBits + 4 * topBits;
        var shiftL = -lowBits + 3 * topBits;
        var shiftR = -lowBits + 2 * topBits;
        var shiftG = -lowBits + topBits;
        var shiftB = -lowBits;
        /* tslint:disable:no-bitwise */
        var mask = (sides - 1) << lowBits;
        /* tslint:enable:no-bitwise */
        // Skipping S from HSL
        // var cubes = sides * sides * sides * sides * sides * sides * sides;
        var cubes = sides * sides * sides * sides * sides * sides * sides;
        // 4 is RGB + Count
        var samples = new Uint32Array(cubes * 4);
        for (var i = 0; i < img.data.length; i += img.channels) {
            var h = hsl(img.data[i], img.data[i + 1], img.data[i + 2]);
            /* tslint:disable:no-bitwise */
            var v = ((~~(img.data[i] * 0.2126 + img.data[i + 1] * 0.7152 + img.data[i + 2] * 0.0722) & mask) << shiftM) + (((h[0]) & mask) << shiftH) + (((h[2]) & mask) << shiftL) + ((img.data[i] & mask) << shiftR) + ((img.data[i + 1] & mask) << shiftG) + ((img.data[i + 2] & mask << shiftB));
            /* tslint:enable:no-bitwise */
            // 4 is RGB + Count
            v *= 4;
            samples[v++] += img.data[i];
            samples[v++] += img.data[i + 1];
            samples[v++] += img.data[i + 2];
            samples[v]++;
        }
        return samples;
    }
    Colorgram.sample = sample;
    function hsl(r, g, b) {
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        /* tslint:disable:no-bitwise */
        var h, s, l = (max + min) >> 1;
        /* tslint:enable:no-bitwise */
        if (max === min) {
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 127 ? d / (510 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
                default:
                    break;
            }
            h /= 6;
        }
        return [h * 255, s * 255, l];
    }
    Colorgram.hsl = hsl;
    /**
     * TODO: sorted only by H
     */
    function sortByHsl(stats) {
        var i;
        for (i = 0; i < stats.length; i++) {
            stats[i][4] = hsl(stats[i][0], stats[i][1], stats[i][2]);
        }
        stats.sort(function (a, b) {
            return b[4][0] - a[4][0];
        });
        for (i = 0; i < stats.length; i++) {
            delete stats[i][4];
        }
        return stats;
    }
    Colorgram.sortByHsl = sortByHsl;
    function pickUsed(samples, cubes) {
        var used = [];
        for (var j = 0; j < cubes; j++) {
            var p = j * 4;
            var s = samples[p + 3];
            if (s) {
                used.push([s, p]);
            }
        }
        return used;
    }
    function sortUsed(used) {
        used.sort(function (a, b) {
            return b[0] - a[0];
        });
    }
    function getColorStats(samples, used, top) {
        var pixels = 0;
        var stats = [];
        var max = Math.min(top, used.length);
        var i;
        for (i = 0; i < max; i++) {
            var count = used[i][0];
            var p = used[i][1];
            /* tslint:disable:no-bitwise */
            var c = [~~(samples[p] / count), ~~(samples[p + 1] / count), ~~(samples[p + 2] / count), count];
            /* tslint:enable:no-bitwise */
            stats.push(c);
            pixels += count;
        }
        for (i = 0; i < stats.length; i++) {
            stats[i][3] /= pixels;
        }
        return stats;
    }
})(Colorgram || (Colorgram = {}));
/// <reference path="colorgram.ts" />
var Colorgram;
(function (Colorgram) {
    'use strict';
    function getPixels(stats, width, proportional, channels) {
        if (proportional === void 0) { proportional = false; }
        if (channels === void 0) { channels = 4 /* RGBAlpha */; }
        var step, k, i, current, end, sum = 0, data = [];
        for (i = 0; i < stats.length; i++) {
            step = proportional ? stats[i][3] : 1 / stats.length;
            current = Math.round(width * sum) * 4;
            end = Math.round(width * (sum + step)) * 4;
            sum += step;
            k = current;
            while (current < end) {
                data[k++] = stats[i][0];
                data[k++] = stats[i][1];
                data[k++] = stats[i][2];
                if (channels === 4 /* RGBAlpha */) {
                    data[k++] = 255;
                }
                current += channels;
            }
        }
        return data;
    }
    Colorgram.getPixels = getPixels;
})(Colorgram || (Colorgram = {}));
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="colorgram.ts" />
module.exports = Colorgram;

},{}]},{},[1])(1)
});