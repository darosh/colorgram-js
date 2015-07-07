/// <reference path="colorgram.ts" />

module Colorgram {
    'use strict';

    export function getPixels(stats:any[],
							  width:number,
							  proportional:boolean = false,
							  channels:Channels = Channels.RGBAlpha):number[] {
        var step:number,
            k:number,
            i:number,
            current:number,
            end:number,
            sum:number = 0,
            data:number[] = [];

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

                if (channels === Channels.RGBAlpha) {
                    data[k++] = 255;
                }

                current += channels;
            }
        }

		return data;
    }
}
