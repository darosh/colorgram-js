export type Data = number[] | any[] | Uint8Array;

/**
 * RGB = 3, RGBAlpha = 4
 * TODO: Alpha not calculated
 * TODO: Grey not supported
 */
export enum Channels {
  // Grey = 1,
  // GreyAlpha = 2,
  RGB = 3,
  RGBAlpha = 4,
}

export interface IImage {
  data: Data;
  // No need for width*height, data.length does the job
  // width:number;
  // height:number;
  channels: Channels;
}

export type Samples = Uint32Array;

export function extract(img: IImage, top: number = 12): any[] {
  const samples: Samples = sample(img);
  const used: number[][] = pickUsed(samples, samples.length / 4);
  sortUsed(used);
  // TODO: Random idea: group similar by HSL (or HUSL?) distance
  return getColorStats(samples, used, top);
}

export function sample(img: IImage): Samples {
  const topBits = 2;

  /* tslint:disable:no-bitwise */
  const sides = 1 << topBits;  // 4
  /* tslint:enable:no-bitwise */

  const shiftM = 2
  const shiftH = 4
  const shiftL = 6

  const mask: number = 0b11000000
  const cubes: number = Math.pow(sides, 3);

  // 4 is RGB + Count
  const samples: Samples = new Uint32Array(cubes * 4);

  for (let i: number = 0; i < img.data.length; i += img.channels) {
    const h: number[] = hsl(img.data[i], img.data[i + 1], img.data[i + 2]);

    /* tslint:disable:no-bitwise */
    let v: number =
      ((~~(img.data[i] * 0.2126 + img.data[i + 1] * 0.7152 + img.data[i + 2] * 0.0722) & mask) >> shiftM) +
      ((h[0] & mask) >> shiftH) +
      ((h[2] & mask) >> shiftL)
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

export function hsl(r: number, g: number, b: number): number[] {
  const max: number = Math.max(r, g, b);
  const min: number = Math.min(r, g, b);

  /* tslint:disable:no-bitwise */
  let h: number = 0;
  let s: number;
  const l: number = (max + min) >> 1;
  /* tslint:enable:no-bitwise */

  if (max === min) {
    s = 0;
  } else {
    const d: number = max - min;
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
export function sortByHsl(stats: any[][]): any[][] {
  let i: number;

  for (i = 0; i < stats.length; i++) {
    stats[i][4] = hsl(stats[i][0], stats[i][1], stats[i][2]);
  }

  stats.sort((a: number[][], b: number[][]): number => {
    return b[4][0] - a[4][0];
  });

  for (i = 0; i < stats.length; i++) {
    delete stats[i][4];
  }

  return stats;
}

function pickUsed(samples: Samples, cubes: number): number[][] {
  const used: number[][] = [];

  for (let j: number = 0; j < cubes; j++) {
    const p: number = j * 4;
    const s: number = samples[p + 3];

    if (s) {
      used.push([s, p]);
    }
  }

  return used;
}

function sortUsed(used: number[][]): void {
  used.sort((a: number[], b: number[]): number => {
    return b[0] - a[0];
  });
}

function getColorStats(samples: Samples, used: number[][], top: number): any[] {
  let pixels: number = 0;
  const stats: any[] = [];
  const max: number = Math.min(top, used.length);
  let i: number;

  for (i = 0; i < max; i++) {
    const count: number = used[i][0];
    const p: number = used[i][1];

    /* tslint:disable:no-bitwise */
    const c: number[] = [~~(samples[p] / count), ~~(samples[p + 1] / count), ~~(samples[p + 2] / count), count];
    /* tslint:enable:no-bitwise */

    stats.push(c);
    pixels += count;
  }

  for (i = 0; i < stats.length; i++) {
    stats[i][3] /= pixels;
  }

  return stats;
}
