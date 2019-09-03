import { Channels } from "./colorgram";

export function getPixels(stats: any[],
                          width: number,
                          proportional: boolean = false,
                          channels: Channels = Channels.RGBAlpha): number[] {
  let step: number;
  let k: number;
  let i: number;
  let current: number;
  let end: number;
  let sum: number = 0;
  const data: number[] = [];

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
