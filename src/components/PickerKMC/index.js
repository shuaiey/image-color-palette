/**
 * Method: K Means Cluster
 * From Colorful Color
 * https://github.com/woshizja/colorful-color
 */
import { rgbToHsl, hslToRgb, rgbToHex } from "./utils.js";

class PickerKMC {
  censusColors(imageData, K, callBack) {
    let start = +new Date();
    let processInfo = {
      colors: 0,
      time: 0,
      kmeansIteration: 0,
      kmeansTime: 0,
      top5Count: 0
    };
    let rows = imageData.height;
    let cols = imageData.width;
    let keys = [];
    let colors_info = [];
    let h_key, s_key, l_key, r, g, b;
    let pixel_count = 0;
    let pixel_step = rows * cols < 600 * 600 ? 1 : 2;
    console.log("pixel step", pixel_step);
    // ?????
    let color_step = Math.round(0.1066 * K * K - 2.7463 * K + 17.2795);
    color_step = color_step < 4 ? 4 : color_step;
    console.log("color step", color_step);

    let hsl, key;
    // 从总像素数据中取样，行列的行走距离都为 pixel_step
    for (let row = 1; row < rows - 1; ) {
      for (let col = 1; col < cols - 1; ) {
        const pindex = row * cols * 4 + col * 4;
        r = imageData.data[pindex];
        g = imageData.data[pindex + 1];
        b = imageData.data[pindex + 2];
        hsl = rgbToHsl(r, g, b);
        if (hsl[2] > 97 || (hsl[2] > 95 && hsl[1] < 30)) {
          col += pixel_step;
          continue; // too bright
        }
        if (hsl[2] < 3 || (hsl[2] < 5 && hsl[1] < 30)) {
          col += pixel_step;
          continue; // too dark
        }
        pixel_count++;
        h_key = Math.floor(hsl[0] / 10) * 10000;
        s_key = Math.floor(hsl[1] / 5) * 100;
        l_key = Math.floor(hsl[2] / 5);
        key = h_key + s_key + l_key;
        let index = keys.indexOf(key);
        if (index < 0) {
          keys.push(key);
          // prettier-ignore
          colors_info.push({
            key: key, fre: 1, r: r, g: g, b: b,
            h: hsl[0], s: hsl[1], l: hsl[2], category: -1
          });
        } else {
          colors_info[index].fre++;
        }
        col += pixel_step;
      }
      row += pixel_step;
    }
    console.log("pixel_count: ", pixel_count);
    processInfo.time = +new Date() - start;
    processInfo.colors = colors_info.length;
    console.log("time for process all pixel: ", processInfo.time);

    start = +new Date();
    // sort and filter rgb_census
    colors_info.sort(function(pre, next) {
      return next.fre - pre.fre;
    });
    let len = colors_info.length;
    console.log("before filter: ", len);
    colors_info = colors_info.filter(color => {
      // isolated color
      let flag = color.fre < 5 - pixel_step && len > 400;
      return !flag;
    });
    console.log("after filter: ", colors_info.length);
    let main_color = [colors_info[0], colors_info[1], colors_info[2]];
    // k-mean clustering
    let init_seed_1 = this.chooseSeedColors(colors_info, K);
    let cluster_res = this.kMC(colors_info, init_seed_1, 100);
    let cluster_res_1 = cluster_res[0];
    cluster_res_1 = cluster_res_1.map(color => {
      return rgbToHex(hslToRgb(color.h, color.s, color.l));
    });
    // // prettier-ignore
    // let r_count = 0, g_count = 0, b_count = 0, f_count = 0;
    // len = colors_info.length;

    // while (len--) {
    //   r_count += colors_info[len].r * colors_info[len].fre;
    //   g_count += colors_info[len].g * colors_info[len].fre;
    //   b_count += colors_info[len].b * colors_info[len].fre;
    //   f_count += colors_info[len].fre;
    // }

    // let average_color = rgbToHsl(
    //   Math.floor(r_count / f_count),
    //   Math.floor(g_count / f_count),
    //   Math.floor(b_count / f_count)
    // );
    // average_color = {
    //   h: average_color[0],
    //   s: average_color[1],
    //   l: average_color[2]
    // };
    let main_color_a =
      "rgba(" +
      colors_info[0].r +
      "," +
      colors_info[0].g +
      "," +
      colors_info[0].b +
      ",0.62)";

    processInfo.kmeansTime = +new Date() - start;
    processInfo.kmeansIteration = cluster_res[1];
    console.log("time for K-means: ", processInfo.kmeansTime);
    // this.setState({
    //   colorsInfo: colors_info,
    //   clusterColors: cluster_res_1,
    //   mainColor: main_color,
    //   averageColor: average_color,
    //   processInfo: processInfo
    // });
    if (callBack instanceof Function) {
      callBack(main_color_a, cluster_res_1);
    }
    return {
      mc: main_color,
      palette: cluster_res_1,
      info: processInfo
    };
  }

  chooseSeedColors(colors, num) {
    let init_seed = [];
    let len = colors.length;
    let l;
    for (let i = 0; i < len; i++) {
      l = init_seed.length;
      let color = colors[i];
      if (!i) {
        color.category = 0;
        // prettier-ignore
        init_seed.push({
          h: color.h,s: color.s,l: color.l,
          category: color.category,fre: color.fre
        });
        continue;
      }
      let j = 0;
      for (; j < l; j++) {
        let h_diff = Math.abs(init_seed[j].h - color.h);
        let s_diff = Math.abs(init_seed[j].s - color.s);
        let l_diff = Math.abs(init_seed[j].l - color.l);
        if (h_diff + s_diff + l_diff < 45) {
          break;
        }
      }
      if (j === l) {
        color.category = init_seed.length;
        // prettier-ignore
        init_seed.push({
          h: color.h,s: color.s,l: color.l,
          category: color.category,fre: color.fre
        });
      }
      if (init_seed.length >= num) {
        break;
      }
    }
    return init_seed;
  }

  kMC(colors, seeds, max_step) {
    let iteration_count = 0;

    while (iteration_count++ < max_step) {
      // filter seeds
      seeds = seeds.filter(seed => {
        return seed;
      });

      // divide colors into different categories with duff's device
      let len = colors.length;
      // //`value ^ 0` is the same as `Math.floor` for positive numbers and `Math.ceil` for negative numbers
      let count = (len / 8) ^ 0;
      let start = len % 8;
      while (start--) {
        this.classifyColor(colors[start], seeds);
      }
      while (count--) {
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
        this.classifyColor(colors[--len], seeds);
      }

      // compute center of category
      len = colors.length;
      let hsl_count = [];
      let category;
      while (len--) {
        category = colors[len].category;
        if (!hsl_count[category]) {
          hsl_count[category] = {};
          hsl_count[category].h = 0;
          hsl_count[category].s = 0;
          hsl_count[category].l = 0;
          hsl_count[category].fre_count = colors[len].fre;
        } else {
          hsl_count[category].fre_count += colors[len].fre;
        }
      }
      len = colors.length;
      while (len--) {
        category = colors[len].category;
        hsl_count[category].h +=
          (colors[len].h * colors[len].fre) / hsl_count[category].fre_count;
        hsl_count[category].s +=
          (colors[len].s * colors[len].fre) / hsl_count[category].fre_count;
        hsl_count[category].l +=
          (colors[len].l * colors[len].fre) / hsl_count[category].fre_count;
      }
      let flag = hsl_count.every((ele, index) => {
        return (
          Math.abs(ele.h - seeds[index].h) < 0.5 &&
          Math.abs(ele.s - seeds[index].s) < 0.5 &&
          Math.abs(ele.l - seeds[index].l) < 0.5
        );
      });
      seeds = hsl_count.map((ele, index) => {
        return {
          h: ele.h,
          s: ele.s,
          l: ele.l,
          category: index,
          fre: ele.fre_count
        };
      });
      if (flag) {
        break;
      }
    }
    console.log("KMC iteration " + iteration_count);
    seeds.sort(function(pre, next) {
      let pre_rgb = hslToRgb(pre.h, pre.s, pre.l);
      pre_rgb = pre_rgb[0] + pre_rgb[1] + pre_rgb[2];
      // let next_h = next.h;
      // next_h = next_h < 30 ? (next_h+330) : next_h;
      let next_rgb = hslToRgb(next.h, next.s, next.l);
      next_rgb = next_rgb[0] + next_rgb[1] + next_rgb[2];
      return next_rgb - pre_rgb;
    });
    return [seeds, iteration_count];
  }

  classifyColor(color, classes) {
    let len = classes.length;
    let min = 10000;
    let min_index;
    while (len--) {
      let distance =
        Math.abs(classes[len].h - color.h) +
        Math.abs(classes[len].s - color.s) +
        Math.abs(classes[len].l - color.l);
      if (distance < min) {
        min = distance;
        min_index = len;
      }
    }
    color.category = min_index;
  }
}

export default PickerKMC;
