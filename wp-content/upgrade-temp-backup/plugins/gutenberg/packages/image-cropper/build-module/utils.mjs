// packages/image-cropper/src/utils.ts
var normalizeRotation = (rotation) => {
  if (rotation >= 0) {
    return rotation % 360;
  }
  return (360 + rotation % 360) % 360;
};
var createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
});
function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}
function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height)
  };
}
async function getCroppedImage(imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }) {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return null;
    }
    const rotRad = getRadianAngle(rotation);
    const { width: boundingBoxWidth, height: boundingBoxHeight } = rotateSize(image.width, image.height, rotation);
    canvas.width = boundingBoxWidth;
    canvas.height = boundingBoxHeight;
    ctx.translate(boundingBoxWidth / 2, boundingBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");
    if (!croppedCtx) {
      return null;
    }
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      croppedCanvas.toBlob((file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        }
      }, "image/jpeg");
    });
  } catch {
    return null;
  }
}
export {
  createImage,
  getCroppedImage,
  getRadianAngle,
  normalizeRotation,
  rotateSize
};
//# sourceMappingURL=utils.mjs.map
