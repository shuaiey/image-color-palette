/**
 * Method: K Means Cluster
 * A minor revision from Colorful Color
 * https://github.com/woshizja/colorful-color
 * 1. delete color_step (because it doesn't use in later)
 * 2. delete color filtering (because it would remove white and black, which cause problem when background color is white and black)
 * 3. delete color sorting
 */
import { rgbToHsl, hslToRgb, rgbToHex } from "./utils";

class PickerKMC {
  censusColors(imageData, K, callBack) {
    let start = performance.now();
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

    let hsl, key;
    // 从总像素数据中取样，行列的行走距离都为 pixel_step
    for (let row = 1; row < rows - 1; ) {
      for (let col = 1; col < cols - 1; ) {
        r = imageData.data[row * cols * 4 + col * 4];
        g = imageData.data[row * cols * 4 + col * 4 + 1];
        b = imageData.data[row * cols * 4 + col * 4 + 2];

        // 使用hsl的原因
        // 转换到HSL空间对于我们提取颜色的目标有以下好处：
        // 1. 原来的RGB中三个值一样重要，对于HSL我们可以使用不同的参数分别去处理三个通道，比如对于色相可以稠密采样，对于明度和饱和度可以适当稀疏采样；
        // 2. 对于不同颜色的控制更加精细准确，原始的RGB空间中我们很难判断两个不同颜色之间他们的RGB值关系，但是对于HSL我们只要关注色相就可以了（其它两个通道也很有用，只是这里选择忽略它们）；
        hsl = rgbToHsl(r, g, b);

        // 过滤过亮过黑的颜色；
        // Filter colors are too bright or too dark
        // if (hsl[2] > 97 || (hsl[2] > 95 && hsl[1] < 30)) {
        //   col += pixel_step;
        //   continue; // too bright
        // }
        // if (hsl[2] < 3 || (hsl[2] < 5 && hsl[1] < 30)) {
        //   col += pixel_step;
        //   continue; // too dark
        // }

        pixel_count++;
        // 另一个减小精度的取样过程，但是我不知道为什么
        // h/10，其他 s/5, l/5
        // 可能原因：
        // h的取值范围 [0, 360], s 与 l 的取值范围 [0, 100]
        // h ~ [0, 36] / s, l ~ [0, 10]
        // 所以虽然 h/10，但如同作者解释，人眼对色相比较敏感，所以取样时可以精确一些
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
    processInfo.time = performance.now() - start;
    processInfo.colors = colors_info.length;
    console.log("time for process all pixel: ", processInfo.time);

    start = performance.now();
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
    // 1. 生成 k 个聚类中心点
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

    processInfo.kmeansTime = performance.now() - start;
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

  /**
   * 生成 k 个聚类中心点 (seed colors)
   * @param {array[objec]} colors color array
   * @param {number} num the value of K
   */
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
          category: color.category, fre: color.fre
        });
        continue;
      }
      let j = 0;
      for (; j < l; j++) {
        let h_diff = Math.abs(init_seed[j].h - color.h);
        let s_diff = Math.abs(init_seed[j].s - color.s);
        let l_diff = Math.abs(init_seed[j].l - color.l);
        // 差异小，说明seed里面有与color[i]相近的颜色
        // 退出循环，就不会有 j === l，开始一轮新的 i 循环
        if (h_diff + s_diff + l_diff < 45) {
          break;
        }
      }
      if (j === l) {
        color.category = init_seed.length;
        // prettier-ignore
        init_seed.push({
          h: color.h, s: color.s, l: color.l,
          category: color.category, fre: color.fre
        });
      }
      if (init_seed.length >= num) {
        break;
      }
    }
    return init_seed;
  }

  /**
   *
   * @param {array[object]} colors 颜色值集合
   * @param {array[object]} seeds 聚类中心点
   * @param {number} max_step 最大迭代次数
   */
  kMC(colors, seeds, max_step) {
    let iteration_count = 0;

    while (iteration_count++ < max_step) {
      // filter seeds
      seeds = seeds.filter(seed => {
        return seed;
      });

      // 1. divide colors into different categories with duff's device
      // 为每个颜色值确定类别属性
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

      // 2. compute center of category
      len = colors.length;
      let hsl_count = [];
      let category;
      // 确定每个类别的颜色数量
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
      // 确定每个类别的 h/s/l 值
      while (len--) {
        category = colors[len].category;
        hsl_count[category].h +=
          (colors[len].h * colors[len].fre) / hsl_count[category].fre_count;
        hsl_count[category].s +=
          (colors[len].s * colors[len].fre) / hsl_count[category].fre_count;
        hsl_count[category].l +=
          (colors[len].l * colors[len].fre) / hsl_count[category].fre_count;
      }
      // 计算确定类别后的h/s/l值与聚类中心 (seeds) 的差异
      // 如果每一个类的差异都小于0.5 则认为已收敛
      let flag = hsl_count.every((ele, index) => {
        return (
          Math.abs(ele.h - seeds[index].h) < 0.5 &&
          Math.abs(ele.s - seeds[index].s) < 0.5 &&
          Math.abs(ele.l - seeds[index].l) < 0.5
        );
      });
      // 重新确认聚类中心
      seeds = hsl_count.map((ele, index) => {
        return {
          h: ele.h,
          s: ele.s,
          l: ele.l,
          category: index,
          fre: ele.fre_count
        };
      });
      // 注意退出循环的顺序，生成seeds在判断flag之前
      if (flag) {
        break;
      }
    }
    console.log("KMC iteration " + iteration_count);
    // 为什么要排序呢？？
    // seeds.sort(function(pre, next) {
    //   let pre_rgb = hslToRgb(pre.h, pre.s, pre.l);
    //   pre_rgb = pre_rgb[0] + pre_rgb[1] + pre_rgb[2];
    //   // let next_h = next.h;
    //   // next_h = next_h < 30 ? (next_h+330) : next_h;
    //   let next_rgb = hslToRgb(next.h, next.s, next.l);
    //   next_rgb = next_rgb[0] + next_rgb[1] + next_rgb[2];
    //   return next_rgb - pre_rgb;
    // });
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
