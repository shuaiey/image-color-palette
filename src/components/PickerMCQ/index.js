/**
 * Method: Median Cut
 * From Sample Media (VOD) App
 * https://github.com/paullewis/sample-media-pwa
 */
/**
 *
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { _convertPixelsToRGB } from "../../utils/imageUtils";

class Swatch {
  static get DEFAULT_DEPTH() {
    return 4;
  }

  getSwatch(imgData) {
    let processInfo = {
      colors: 0,
      time: 0
    };
    const start = performance.now();
    const rgbArray = _convertPixelsToRGB(imgData);
    const buckets = this.quantize(rgbArray);
    const swatch = this.orderByLuminance(buckets);
    const end = performance.now();
    processInfo.time = end - start;
    return {
      mc: this.getMostVariantColor(swatch),
      palette: swatch.slice(1, 9),
      info: processInfo
    };
  }

  getSwatchByCanvas(imgCanvas) {
    let processInfo = {
      colors: 0,
      time: 0
    };
    const start = performance.now();
    const ctx = imgCanvas.getContext("2d");
    const imgData = ctx.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
    const rgbArray = _convertPixelsToRGB(imgData);
    const buckets = this.quantize(rgbArray);
    const swatch = this.orderByLuminance(buckets);
    const end = performance.now();
    processInfo.time = end - start;
    return {
      mc: this.getMostVariantColor(swatch),
      palette: swatch.slice(1, 9),
      info: processInfo
    };
  }

  _findBiggestRange(rgbVals) {
    let rMin = Number.POSITIVE_INFINITY;
    let rMax = Number.NEGATIVE_INFINITY;

    let gMin = Number.POSITIVE_INFINITY;
    let gMax = Number.NEGATIVE_INFINITY;

    let bMin = Number.POSITIVE_INFINITY;
    let bMax = Number.NEGATIVE_INFINITY;

    rgbVals.forEach(pixel => {
      rMin = Math.min(rMin, pixel.r);
      rMax = Math.max(rMax, pixel.r);
      gMin = Math.min(gMin, pixel.g);
      gMax = Math.max(gMax, pixel.g);
      bMin = Math.min(bMin, pixel.b);
      bMax = Math.max(bMax, pixel.b);
    });

    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;

    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return "r";
    } else if (biggestRange === gRange) {
      return "g";
    }
    return "b";
  }

  quantize(rgbVals, depth = 0, maxDepth = Swatch.DEFAULT_DEPTH) {
    if (depth === 0) {
      console.log(`Quantizing to ${Math.pow(2, maxDepth)} buckets.`);
    }

    // Base case: average the RGB values down to a single average value.
    if (depth === maxDepth) {
      const color = rgbVals.reduce(
        (prev, curr) => {
          prev.r += curr.r;
          prev.g += curr.g;
          prev.b += curr.b;
          return prev;
        },
        { r: 0, g: 0, b: 0 }
      );

      color.r = Math.round(color.r / rgbVals.length);
      color.g = Math.round(color.g / rgbVals.length);
      color.b = Math.round(color.b / rgbVals.length);

      return [color];
    }

    // Recursive case: find the component with the biggest range,
    // sort by it, then divide the RGB values in half, and go again.
    const componentToSortBy = this._findBiggestRange(rgbVals);
    rgbVals.sort((p1, p2) => {
      return p1[componentToSortBy] - p2[componentToSortBy];
    });

    const mid = rgbVals.length / 2;
    return [
      ...this.quantize(rgbVals.slice(0, mid), depth + 1, maxDepth),
      ...this.quantize(rgbVals.slice(mid + 1), depth + 1, maxDepth)
    ];
  }

  orderByLuminance(rgbVals) {
    const calcLuminance = p => {
      return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
    };

    return rgbVals.sort((p1, p2) => {
      return calcLuminance(p1) - calcLuminance(p2);
    });
  }

  getMostVariantColor(rgbVals) {
    let index = 0;
    let max = Number.NEGATIVE_INFINITY;
    rgbVals
      // Remap each RGB value to a variance by taking the max component from the
      // min component.
      .map(v => Math.max(v.r, v.g, v.b) - Math.min(v.r, v.g, v.b))

      // Then step through each value and find which has the largest value.
      .forEach((v, i) => {
        if (v > max) {
          index = i;
          max = v;
        }
      });

    return rgbVals[index];
  }

  lighten(rgbVal, percentage) {
    const factor = 1 + percentage / 100;
    return this._adjustColor(rgbVal, factor);
  }

  darken(rgbVal, percentage) {
    const factor = 1 - percentage / 100;
    return this._adjustColor(rgbVal, factor);
  }

  _clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  _adjustColor(rgbVal, factor) {
    return {
      r: this._clamp(Math.round(rgbVal.r * factor), 0, 255),
      g: this._clamp(Math.round(rgbVal.g * factor), 0, 255),
      b: this._clamp(Math.round(rgbVal.b * factor), 0, 255)
    };
  }
}

export default Swatch;
