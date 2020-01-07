function _convertPixelsToRGB(pixels) {
  const width = pixels.width;
  const height = pixels.height;
  const rgbVals = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
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

function _rgbArray2String(rgbArr) {
  return rgbArr.map(n => `rgb(${n.join(",")})`);
}

function _rgbObj2String(rgbObj) {
  return `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`;
}

function _getImageData(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = (canvas.width = image.width);
  const height = (canvas.height = image.height);
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
}

function _checkImgData(imgData) {
  if (!imgData) {
    try {
      imgData = getImageData(imgRef.current);
    } catch {
      window.alert("Please upload an image.");
    }
  }
  return imgData;
}

export {
  _convertPixelsToRGB,
  _rgbArray2String,
  _rgbObj2String,
  _getImageData,
  _checkImgData
};
