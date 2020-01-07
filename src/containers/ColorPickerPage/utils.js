const getImageData = function(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = (canvas.width = image.width);
  const height = (canvas.height = image.height);
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
};

export { getImageData };
