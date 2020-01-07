/**
 * Method: Octree
 * Code in this file might be modified and commented based on original code by XadillaX
 * https://github.com/XadillaX/theme-color-test/blob/master/version3/octree.js
 */
/**
 * Original code declaration:
 * ---------------------------------------
 * XadillaX created at 2014-09-12 10:20:54
 *
 * Copyright (c) 2014 Huaban.com, all rights
 * reserved
 */

const SIGBITS = 5;
const PSHIFT = 8 - SIGBITS;

/**
 * red: Red channel accumulating value of current node. 该节点 R 通道累加值。
 * green: Green channel accumulating value. G 累加值。
 * blue: Blue channel accumulating value. B 累加值。
 * isLeaf: Is or is not leaf node. 表明该节点是否为叶子节点。
 * pixelCount: The count of color on current node. 在该节点的颜色一共插入了几次。
 * children: 八个子节点指针。
 * next: reducible 链表的下一个节点指针。
 */
const OctreeNode = function() {
  this.red = 0;
  this.green = 0;
  this.blue = 0;
  this.isLeaf = false;
  this.pixelCount = 0;
  this.children = new Array(8).fill(null);
  this.next = null;
};

class Octree {
  constructor() {
    this.root = new OctreeNode();
    this.leafNum = 0;
    this.reducible = new Array(7).fill(null);
    this.colors = {};
  }

  createNode(parent, idx, level) {
    const node = new OctreeNode();
    if (level === 7) {
      node.isLeaf = true;
      this.leafNum++;
    } else {
      // ???
      node.next = this.reducible[level];
      this.reducible[level] = node;
    }
    return node;
  }

  /**
   * Octree Insertion
   * 八叉树插入
   * @param {OctreeNode} node
   * @param {Object} color
   * @param {Number} level
   */
  addColor(node, color, level) {
    if (node.isLeaf) {
      node.pixelCount++;
      node.red += color.r;
      node.green += color.g;
      node.blue += color.b;
    } else {
      // Octree encoding. 八叉树编码
      // Since js stores number as float, so the bit operation is not very efficient.
      // Therefore here use string
      // 由于 js 内部都是以浮点型存储数值，所以位运算并没有那么高效
      // 在此使用直接转换字符串的方式提取某一位的值
      let str = "";
      // decimal to binary with toString(2)
      let r = color.r.toString(2);
      let g = color.g.toString(2);
      let b = color.b.toString(2);
      // zero padding
      while (r.length < 8) r = "0" + r;
      while (g.length < 8) g = "0" + g;
      while (b.length < 8) b = "0" + b;
      // from 000 to 111
      // str += r[level] + g[level] + b[level];
      str += r[level];
      str += g[level];
      str += b[level];
      const idx = parseInt(str, 2);
      // new color -> new node
      if (node.children[idx] === null) {
        node.children[idx] = this.createNode(node, idx, level + 1);
      }
      this.addColor(node.children[idx], color, level + 1);
    }
  }

  /**
   * Octree Merge
   * 八叉树归并
   * 八叉树的数据结构保证了所有的兄弟节点肯定是在一个相近的颜色范围内
   */
  reduceTree() {
    // reducible 的最深层为 reducible[6]
    let lv = 6;
    while (this.reducible[lv] === null) lv--;
    // ???
    const node = this.reducible[lv];
    this.reducible[lv] = node.next;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < 8; i++) {
      if (node.children[i] === null) continue;
      r += node.children[i].red;
      g += node.children[i].green;
      b += node.children[i].blue;
      count += node.children[i].pixelCount;
      this.leafNum--;
    }

    node.isLeaf = true;
    node.red = r;
    node.green = g;
    node.blue = b;
    node.pixelCount = count;
    this.leafNum++;
  }

  buildOctree(pixels, maxColors) {
    for (let i = 0; i < pixels.length; i++) {
      // 添加颜色
      this.addColor(this.root, pixels[i], 0);
      // Color Merge. 色彩归并：合并叶子结点
      while (this.leafNum > maxColors) this.reduceTree();
    }
  }

  getSwatch(imgData, maxColors = 256) {
    let processInfo = {
      time: 0
    };
    const start = performance.now();
    const pixelArray = this._convertPixelsToRGB(imgData);
    // const pixelArray = this._convertPixelsToRGBModified(imgData);
    this.buildOctree(pixelArray, maxColors);
    this.colorsStats(this.root);
    let result = [];
    for (var key in this.colors) {
      result.push({ color: key, count: this.colors[key] });
    }
    result.sort((a, b) => b.count - a.count);
    const end = performance.now();
    processInfo.time = end - start;
    return {
      mc: result[0].color,
      palette: result.slice(1).map(r => r.color),
      info: processInfo
    };
  }

  _convertPixelsToRGBModified(pixels, pixel_step) {
    const width = pixels.width;
    const height = pixels.height;
    if (!pixel_step) {
      pixel_step = width * height < 600 * 600 ? 1 : 2;
    }
    let keys = [],
      colors = [];
    let r, g, b;
    for (let y = 0; y < height - 1; y += pixel_step) {
      for (let x = 0; x < width - 1; x += pixel_step) {
        const pindex = (y * width + x) * 4;
        r = pixels.data[pindex];
        g = pixels.data[pindex + 1];
        b = pixels.data[pindex + 2];
        const key = this._getColorIndex(r >> PSHIFT, g >> PSHIFT, b >> PSHIFT);
        const cindex = keys.indexOf(key);
        if (cindex < 0) {
          keys.push(key);
          colors.push({ r, g, b, key, count: 1 });
        } else {
          colors[cindex].count++;
        }
      }
    }
    return colors;
  }

  _convertPixelsToRGB(pixels, pixel_step) {
    const width = pixels.width;
    const height = pixels.height;
    if (!pixel_step) {
      pixel_step = width * height < 600 * 600 ? 1 : 2;
    }
    const rgbVals = [];
    for (let y = 0; y < height; y += pixel_step) {
      for (let x = 0; x < width; x += pixel_step) {
        const index = (y * width + x) * 4;
        rgbVals.push({
          r: pixels.data[index],
          g: pixels.data[index + 1],
          b: pixels.data[index + 2]
        });
      }
    }
    return rgbVals;
  }

  _getColorIndex(r, g, b) {
    return (r << (2 * SIGBITS)) + (g << SIGBITS) + b;
  }

  colorsStats(node) {
    if (node.isLeaf) {
      var r = parseInt(node.red / node.pixelCount).toString(16);
      var g = parseInt(node.green / node.pixelCount).toString(16);
      var b = parseInt(node.blue / node.pixelCount).toString(16);
      if (r.length === 1) r = "0" + r;
      if (g.length === 1) g = "0" + g;
      if (b.length === 1) b = "0" + b;

      var color = "#" + r + g + b;
      if (this.colors[color]) this.colors[color] += node.pixelCount;
      else this.colors[color] = node.pixelCount;

      return;
    }

    for (var i = 0; i < 8; i++) {
      if (null !== node.children[i]) {
        this.colorsStats(node.children[i]);
      }
    }
  }
}

export default Octree;
