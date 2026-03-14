// packages/vips/src/vips-worker.ts
import { wrap, terminate } from "@wordpress/worker-threads";
import { workerCode } from "./worker-code.mjs";
var worker;
var workerAPI;
var workerBlobUrl;
function getWorkerAPI() {
  if (workerAPI === void 0) {
    const blob = new Blob([workerCode], {
      type: "application/javascript"
    });
    workerBlobUrl = URL.createObjectURL(blob);
    worker = new Worker(workerBlobUrl, { type: "module" });
    workerAPI = wrap(worker);
  }
  return workerAPI;
}
async function vipsConvertImageFormat(id, buffer, inputType, outputType, quality = 0.82, interlaced = false) {
  const api = getWorkerAPI();
  return api.convertImageFormat(
    id,
    buffer,
    inputType,
    outputType,
    quality,
    interlaced
  );
}
async function vipsCompressImage(id, buffer, type, quality = 0.82, interlaced = false) {
  const api = getWorkerAPI();
  return api.compressImage(id, buffer, type, quality, interlaced);
}
async function vipsResizeImage(id, buffer, type, resize, smartCrop = false, quality = 0.82) {
  const api = getWorkerAPI();
  return api.resizeImage(id, buffer, type, resize, smartCrop, quality);
}
async function vipsHasTransparency(buffer) {
  const api = getWorkerAPI();
  return api.hasTransparency(buffer);
}
async function vipsRotateImage(id, buffer, type, orientation) {
  const api = getWorkerAPI();
  return api.rotateImage(id, buffer, type, orientation);
}
async function vipsCancelOperations(id) {
  const api = getWorkerAPI();
  return api.cancelOperations(id);
}
function terminateVipsWorker() {
  if (workerAPI) {
    terminate(workerAPI);
    workerAPI = void 0;
    worker = void 0;
  }
  if (workerBlobUrl) {
    URL.revokeObjectURL(workerBlobUrl);
    workerBlobUrl = void 0;
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
//# sourceMappingURL=vips-worker.mjs.map
