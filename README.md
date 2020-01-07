# Image Color Palette

⇢ A [demo](https://liebeg.github.io/) app is here.

## Introduction

This project originates from my passion to color, and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In this project, I collected some basic or popular approaches to generate color palette from an image, they are:

- Uniform/One-pass Quantization by me,
- K Means Cluster by [woshizja](https://github.com/woshizja/colorful-color), and small modified version by me,
- Median Cut Method by [GoogleChromeLabs](https://github.com/GoogleChromeLabs/sample-media-pwa),
- Modified Median Cut Method by [Lokesh Dhakar](https://github.com/lokesh/color-thief),
- Octree Method by [XadillaX](https://github.com/XadillaX/theme-color-test/blob/master/version3/octree.js),

respectively.

To run locally:

- with yarn, run `yarn`, then `yarn start` in console
- with npm, run `npm i`, then `npm start` in console

## Example

To a same image, different methods may produce very different results. And also, the same method has different implementations, which depends on how the developer quantize the image data. Later I'll write an article on "About" page of the demo. For a quick grasp, the following image may explain something.

![Results of a BW image and a green-tone image](https://github.com/LiebeG/image-color-palette/raw/master/public/group.jpg)

It's hard to say which method is better for the first BW image, but for the second green-tone frog image, **Modified Median Cut** method and **Octree** method produce some very different color from the image. The reason for this case is because, first, they caculate colors not count; second, for optimization, they omit many image data (eg., some bit operation) (Media Cut method by GoogleChromeLabs doesn't omit image data, therefore they don't produce the purple color).

## Reference

Below are references of this project.
P.S. _During the development of this project, I read many articles and some books or papers for references. If I miss your reference, please send me a msg. I'll add then ;>_

### Projects

- **github**: [colorful color](https://github.com/woshizja/colorful-color) / **demo**: [Link](https://woshizja.github.io/colorful-color/) / **author**: woshizja(github) / **article**: [图像颜色提取](https://segmentfault.com/a/1190000009832996) / K-Means
- **github**: [Color Thief](https://github.com/lokesh/color-thief) / **demo**: [Link](https://lokeshdhakar.com/projects/color-thief/) / **author**: [Lokesh Dhakar](https://lokeshdhakar.com/) / Median Cut
- **github**: [octree.js](https://github.com/XadillaX/theme-color-test/blob/master/version3/octree.js) / **author**: XadillaX / **article**: [图片主题色提取算法小结](https://xcoder.in/2014/09/17/theme-color-extract/#%E4%B8%BB%E9%A2%98%E8%89%B2%E6%8F%90%E5%8F%96-Node-js-%E5%8C%85%E2%80%94%E2%80%94thmclrx) / Octree

### Articles and Books

- Leptonica, [Color Quantization](http://www.leptonica.org/color-quantization.html), 2008
- Rosetta code, [Color quantization in different implementations](http://rosettacode.org/wiki/Color_quantization)
- Leeoniya, [RgbQuant.js](https://github.com/leeoniya/RgbQuant.js), 2014
- woshizja, [图像颜色提取](http://www.voidcn.com/article/p-hybxbtsc-e.html), 2017
- TwinklingStar, [八叉树颜色量化](http://www.twinklingstar.cn/2013/491/octree-quantization/), 2013
- Steven Segenchuk, [An Overview of Color Quantization Techniques](http://web.cs.wpi.edu/~matt/courses/cs563/talks/color_quant/CQindex.html), 1997

### Some similar projects

But I didn't get to read and practice (probably can be your references).

- **gitHub**: [ImageColorTheme](https://github.com/rainyear/ImageColorTheme) / **author**: rainyear / **article**: [图像主题色提取算法](https://www.jianshu.com/p/5436cf3d972a) / MMCQ and K-Means

## Contributing

If you have any better solution or advices, ALWAYS WELCOME!

## To Do

- [ ] Add testing
- [ ] Optimize code
