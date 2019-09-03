/**
 * RGB = 3, RGBAlpha = 4
 * TODO: Alpha not calculated
 * TODO: Grey not supported
 */
export var Channels;
(function (Channels) {
    // Grey = 1,
    // GreyAlpha = 2,
    Channels[Channels["RGB"] = 3] = "RGB";
    Channels[Channels["RGBAlpha"] = 4] = "RGBAlpha";
})(Channels || (Channels = {}));
export function extract(img, top) {
    if (top === void 0) { top = 12; }
    var samples = sample(img);
    var used = pickUsed(samples, samples.length / 4);
    sortUsed(used);
    // TODO: Random idea: group similar by HSL (or HUSL?) distance
    return getColorStats(samples, used, top);
}
export function sample(img) {
    var topBits = 2;
    /* tslint:disable:no-bitwise */
    var sides = 1 << topBits; // 4
    /* tslint:enable:no-bitwise */
    var shiftM = 2;
    var shiftH = 4;
    var shiftL = 6;
    var mask = 192;
    var cubes = Math.pow(sides, 3);
    // 4 is RGB + Count
    var samples = new Uint32Array(cubes * 4);
    for (var i = 0; i < img.data.length; i += img.channels) {
        var h = hsl(img.data[i], img.data[i + 1], img.data[i + 2]);
        /* tslint:disable:no-bitwise */
        var v = ((~~(img.data[i] * 0.2126 + img.data[i + 1] * 0.7152 + img.data[i + 2] * 0.0722) & mask) >> shiftM) +
            ((h[0] & mask) >> shiftH) +
            ((h[2] & mask) >> shiftL);
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
export function hsl(r, g, b) {
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    /* tslint:disable:no-bitwise */
    var h = 0;
    var s;
    var l = (max + min) >> 1;
    /* tslint:enable:no-bitwise */
    if (max === min) {
        s = 0;
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
/**
 * TODO: sorted only by H
 */
export function sortByHsl(stats) {
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
//# sourceMappingURL=colorgram.js.map