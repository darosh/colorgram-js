export declare type Data = number[] | any[] | Uint8Array;
/**
 * RGB = 3, RGBAlpha = 4
 * TODO: Alpha not calculated
 * TODO: Grey not supported
 */
export declare enum Channels {
    RGB = 3,
    RGBAlpha = 4
}
export interface IImage {
    data: Data;
    channels: Channels;
}
export declare type Samples = Uint32Array;
export declare function extract(img: IImage, top?: number): any[];
export declare function sample(img: IImage): Samples;
export declare function hsl(r: number, g: number, b: number): number[];
/**
 * TODO: sorted only by H
 */
export declare function sortByHsl(stats: any[][]): any[][];
//# sourceMappingURL=colorgram.d.ts.map