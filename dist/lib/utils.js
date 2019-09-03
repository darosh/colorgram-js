import { Channels } from "./colorgram";
export function getPixels(stats, width, proportional, channels) {
    if (proportional === void 0) { proportional = false; }
    if (channels === void 0) { channels = Channels.RGBAlpha; }
    var step;
    var k;
    var i;
    var current;
    var end;
    var sum = 0;
    var data = [];
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
//# sourceMappingURL=utils.js.map