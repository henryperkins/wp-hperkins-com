"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/image-cropper/src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  createImage: () => createImage,
  getCroppedImage: () => getCroppedImage,
  getRadianAngle: () => getRadianAngle,
  normalizeRotation: () => normalizeRotation,
  rotateSize: () => rotateSize
});
module.exports = __toCommonJS(utils_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createImage,
  getCroppedImage,
  getRadianAngle,
  normalizeRotation,
  rotateSize
});
//# sourceMappingURL=utils.cjs.map
