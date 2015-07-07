/// <reference path="typings/tsd.d.ts" />
declare module Colorgram {
    type Data = number[] | any[] | Uint8Array;
    /**
     * RGB = 3, RGBAlpha = 4
     * TODO: Alpha not calculated
     * TODO: Grey not supported
     */
    enum Channels {
        RGB = 3,
        RGBAlpha = 4,
    }
    interface IImage {
        data: Data;
        channels: Channels;
    }
    type Samples = Uint32Array;
    function extract(img: IImage, top?: number): any[];
    function sample(img: IImage): Samples;
    function hsl(r: number, g: number, b: number): number[];
    /**
     * TODO: sorted only by H
     */
    function sortByHsl(stats: any[][]): any[][];
}
declare module Colorgram {
    function getPixels(stats: any[], width: number, proportional?: boolean, channels?: Channels): number[];
}
