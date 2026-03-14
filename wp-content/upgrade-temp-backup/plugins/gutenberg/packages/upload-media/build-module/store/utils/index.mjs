// packages/upload-media/src/store/utils/index.ts
import { ImageFile } from "../../image-file.mjs";
import { getFileBasename } from "../../utils.mjs";
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
  const fileName = `${getFileBasename(file.name)}.${ext}`;
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
    const basename = getFileBasename(file.name);
    if (scaledSuffix) {
      fileName = file.name.replace(basename, `${basename}-scaled`);
    } else if (addSuffix) {
      fileName = file.name.replace(
        basename,
        `${basename}-${width}x${height}`
      );
    }
  }
  const resultFile = new ImageFile(
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
  const basename = getFileBasename(file.name);
  const fileName = file.name.replace(basename, `${basename}-rotated`);
  const resultFile = new ImageFile(
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
export {
  terminateVipsWorker,
  vipsCancelOperations,
  vipsCompressImage,
  vipsConvertImageFormat,
  vipsHasTransparency,
  vipsResizeImage,
  vipsRotateImage
};
//# sourceMappingURL=index.mjs.map
