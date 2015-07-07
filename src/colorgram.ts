module Colorgram {
    'use strict';

    export type Data = number[]|any[]|Uint8Array;

    /**
     * RGB = 3, RGBAlpha = 4
     * TODO: Alpha not calculated
     * TODO: Grey not supported
     */
    export enum Channels {
        // Grey = 1,
        // GreyAlpha = 2,
        RGB = 3,
        RGBAlpha = 4
    }

    export interface IImage {
        data:Data;
        // No need for width*height, data.length does the job
        // width:number;
        // height:number;
        channels:Channels;
    }

	export type Samples = Uint32Array;

	export function extract(img:IImage, top:number = 12):any[] {
        var samples:Samples = sample(img);
        var used:number[][] = pickUsed(samples, samples.length / 4);
        sortUsed(used);
        // TODO: Random idea: group similar by HSL (or HUSL?) distance
        return getColorStats(samples, used, top);
    }

    export function sample(img:IImage):Samples {
        var topBits:number = 2;
        var lowBits:number = 8 - topBits;

        /* tslint:disable:no-bitwise */
		var sides:number = 1 << topBits;
		/* tslint:enable:no-bitwise */

        // Skipping S from HSL
        // var shiftS:number = -lowBits + 6 * topBits;
        var shiftM:number = -lowBits + 5 * topBits;
        var shiftH:number = -lowBits + 4 * topBits;
        var shiftL:number = -lowBits + 3 * topBits;
        var shiftR:number = -lowBits + 2 * topBits;
        var shiftG:number = -lowBits + topBits;
        var shiftB:number = -lowBits;

		/* tslint:disable:no-bitwise */
		var mask:number = (sides - 1) << lowBits;
		/* tslint:enable:no-bitwise */

        // Skipping S from HSL
        // var cubes = sides * sides * sides * sides * sides * sides * sides;
        var cubes:number = sides * sides * sides * sides * sides * sides * sides;

        // 4 is RGB + Count
        var samples:Samples = new Uint32Array(cubes * 4);

        for (var i:number = 0; i < img.data.length; i += img.channels) {
            var h:number[] = hsl(img.data[i], img.data[i + 1], img.data[i + 2]);

			/* tslint:disable:no-bitwise */
			var v:number =
                // Skipping S from HSL
                // (((sss[1]) & mask) << shiftS) +
                ((~~(img.data[i] * 0.2126 + img.data[i + 1] * 0.7152 + img.data[i + 2] * 0.0722) & mask) << shiftM) +
                (((h[0]) & mask) << shiftH) +
                (((h[2]) & mask) << shiftL) +
                ((img.data[i] & mask) << shiftR) +
                ((img.data[i + 1] & mask) << shiftG) +
                ((img.data[i + 2] & mask << shiftB));
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

    export function hsl(r:number, g:number, b:number):number[] {
        var max:number = Math.max(r, g, b),
            min:number = Math.min(r, g, b);

		/* tslint:disable:no-bitwise */
        var h:number,
            s:number,
            l:number = (max + min) >> 1;
		/* tslint:enable:no-bitwise */

        if (max === min) {
            h = s = 0;
        } else {
			var d:number = max - min;
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
    export function sortByHsl(stats:any[][]):any[][] {
        var i:number;

		for (i = 0; i < stats.length; i++) {
            stats[i][4] = hsl(stats[i][0], stats[i][1], stats[i][2]);
        }

        stats.sort(function (a:number[][], b:number[][]):number {
            return b[4][0] - a[4][0];
        });

		for (i = 0; i < stats.length; i++) {
			delete stats[i][4];
		}

		return stats;
    }

    function pickUsed(samples:Samples, cubes:number):number[][] {
        var used:number[][] = [];

        for (var j:number = 0; j < cubes; j++) {
            var p:number = j * 4;
            var s:number = samples[p + 3];

            if (s) {
                used.push([s, p]);
            }
        }

        return used;
    }

    function sortUsed(used:number[][]):void {
        used.sort(function (a:number[], b:number[]):number {
            return b[0] - a[0];
        });
    }

    function getColorStats(samples:Samples, used:number[][], top:number):any[] {
        var pixels:number = 0;
        var stats:any[] = [];
        var max:number = Math.min(top, used.length);
        var i:number;

        for (i = 0; i < max; i++) {
            var count:number = used[i][0];
            var p:number = used[i][1];

			/* tslint:disable:no-bitwise */
            var c:number[] = [~~(samples[p] / count), ~~(samples[p + 1] / count), ~~(samples[p + 2] / count), count];
			/* tslint:enable:no-bitwise */

            stats.push(c);
            pixels += count;
        }

        for (i = 0; i < stats.length; i++) {
            stats[i][3] /= pixels;
        }

        return stats;
    }
}
