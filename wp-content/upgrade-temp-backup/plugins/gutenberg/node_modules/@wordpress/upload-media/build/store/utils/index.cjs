"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/upload-media/src/store/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  terminateVipsWorker: () => terminateVipsWorker,
  vipsCancelOperations: () => vipsCancelOperations,
  vipsCompressImage: () => vipsCompressImage,
  vipsConvertImageFormat: () => vipsConvertImageFormat,
  vipsHasTransparency: () => vipsHasTransparency,
  vipsResizeImage: () => vipsResizeImage,
  vipsRotateImage: () => vipsRotateImage
});
module.exports = __toCommonJS(utils_exports);
var import_image_file = require("../../image-file.cjs");
var import_utils = require("../../utils.cjs");
var vipsModulePromise;
var vipsModule;
function loadVipsModule() {
  if (!vipsModulePromise) {
    vipsModulePromise = import("@wordpress/vips/worker").then(
      (mod) => {
        vipsModule = mod;
        return mod;
      }
    );
  }
  return vipsModulePromise;
}
async function vipsConvertImageFormat(id, file, type, quality, interlaced) {
  const { vipsConvertImageFormat: convertImageFormat } = await loadVipsModule();
  const buffer = await convertImageFormat(
    id,
    await file.arrayBuffer(),
    file.type,
    type,
    quality,
    interlaced
  );
  const ext = type.split("/")[1];
  const fileName = `${(0, import_utils.getFileBasename)(file.name)}.${ext}`;
  return new File([new Blob([buffer])], fileName, {
    type
  });
}
async function vipsCompressImage(id, file, quality, interlaced) {
  const { vipsCompressImage: compressImage } = await loadVipsModule();
  const buffer = await compressImage(
    id,
    await file.arrayBuffer(),
    file.type,
    quality,
    interlaced
  );
  return new File(
    [new Blob([buffer], { type: file.type })],
    file.name,
    { type: file.type }
  );
}
async function vipsHasTransparency(url) {
  const { vipsHasTransparency: hasTransparency } = await loadVipsModule();
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }
  return hasTransparency(await response.arrayBuffer());
}
async function vipsResizeImage(id, file, resize, smartCrop, addSuffix, signal, scaledSuffix, quality) {
  if (signal?.aborted) {
    throw new Error("Operation aborted");
  }
  const { vipsResizeImage: resizeImage } = await loadVipsModule();
  const { buffer, width, height, originalWidth, originalHeight } = await resizeImage(
    id,
    await file.arrayBuffer(),
    file.type,
    resize,
    smartCrop,
    quality
  );
  let fileName = file.name;
  const wasResized = originalWidth > width || originalHeight > height;
  if (wasResized) {
    const basename = (0, import_utils.getFileBasename)(file.name);
    if (scaledSuffix) {
      fileName = file.name.replace(basename, `${basename}-scaled`);
    } else if (addSuffix) {
      fileName = file.name.replace(
        basename,
        `${basename}-${width}x${height}`
      );
    }
  }
  const resultFile = new import_image_file.ImageFile(
    new File(
      [new Blob([buffer], { type: file.type })],
      fileName,
      {
        type: file.type
      }
    ),
    width,
    height,
    originalWidth,
    originalHeight
  );
  return resultFile;
}
async function vipsRotateImage(id, file, orientation, signal) {
  if (signal?.aborted) {
    throw new Error("Operation aborted");
  }
  if (orientation === 1) {
    return file;
  }
  const { vipsRotateImage: rotateImage } = await loadVipsModule();
  const { buffer, width, height } = await rotateImage(
    id,
    await file.arrayBuffer(),
    file.type,
    orientation
  );
  const basename = (0, import_utils.getFileBasename)(file.name);
  const fileName = file.name.replace(basename, `${basename}-rotated`);
  const resultFile = new import_image_file.ImageFile(
    new File(
      [new Blob([buffer], { type: file.type })],
      fileName,
      {
        type: file.type
      }
    ),
    width,
    height
  );
  return resultFile;
}
async function vipsCancelOperations(id) {
  if (!vipsModule) {
    return false;
  }
  return vipsModule.vipsCancelOperations(id);
}
function terminateVipsWorker() {
  if (vipsModule) {
    vipsModule.terminateVipsWorker();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  terminateVipsWorker,
  vipsCancelOperations,
  vipsCompressImage,
  vipsConvertImageFormat,
  vipsHasTransparency,
  vipsResizeImage,
  vipsRotateImage
});
//# sourceMappingURL=index.cjs.map
