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

// packages/upload-media/src/store/private-selectors.ts
var private_selectors_exports = {};
__export(private_selectors_exports, {
  getActiveImageProcessingCount: () => getActiveImageProcessingCount,
  getActiveUploadCount: () => getActiveUploadCount,
  getAllItems: () => getAllItems,
  getBlobUrls: () => getBlobUrls,
  getFailedItems: () => getFailedItems,
  getItem: () => getItem,
  getItemProgress: () => getItemProgress,
  getPausedUploadForPost: () => getPausedUploadForPost,
  getPendingImageProcessing: () => getPendingImageProcessing,
  getPendingUploads: () => getPendingUploads,
  hasPendingItemsByParentId: () => hasPendingItemsByParentId,
  isBatchUploaded: () => isBatchUploaded,
  isPaused: () => isPaused,
  isUploadingToPost: () => isUploadingToPost
});
module.exports = __toCommonJS(private_selectors_exports);
var import_types = require("./types.cjs");
function getAllItems(state) {
  return state.queue;
}
function getItem(state, id) {
  return state.queue.find((item) => item.id === id);
}
function isBatchUploaded(state, batchId) {
  const batchItems = state.queue.filter(
    (item) => batchId === item.batchId
  );
  return batchItems.length === 0;
}
function isUploadingToPost(state, postOrAttachmentId) {
  return state.queue.some(
    (item) => item.currentOperation === import_types.OperationType.Upload && item.additionalData.post === postOrAttachmentId
  );
}
function getPausedUploadForPost(state, postOrAttachmentId) {
  return state.queue.find(
    (item) => item.status === import_types.ItemStatus.Paused && item.additionalData.post === postOrAttachmentId
  );
}
function isPaused(state) {
  return state.queueStatus === "paused";
}
function getBlobUrls(state, id) {
  return state.blobUrls[id] || [];
}
function getActiveUploadCount(state) {
  return state.queue.filter(
    (item) => item.currentOperation === import_types.OperationType.Upload
  ).length;
}
function getPendingUploads(state) {
  return state.queue.filter((item) => {
    const nextOperation = Array.isArray(item.operations?.[0]) ? item.operations[0][0] : item.operations?.[0];
    return nextOperation === import_types.OperationType.Upload && item.currentOperation !== import_types.OperationType.Upload;
  });
}
function getActiveImageProcessingCount(state) {
  return state.queue.filter(
    (item) => item.currentOperation === import_types.OperationType.ResizeCrop || item.currentOperation === import_types.OperationType.Rotate
  ).length;
}
function getPendingImageProcessing(state) {
  return state.queue.filter((item) => {
    const nextOperation = Array.isArray(item.operations?.[0]) ? item.operations[0][0] : item.operations?.[0];
    return (nextOperation === import_types.OperationType.ResizeCrop || nextOperation === import_types.OperationType.Rotate) && item.currentOperation !== import_types.OperationType.ResizeCrop && item.currentOperation !== import_types.OperationType.Rotate;
  });
}
function getFailedItems(state) {
  return state.queue.filter((item) => item.error !== void 0);
}
function hasPendingItemsByParentId(state, parentId) {
  return state.queue.some((item) => item.parentId === parentId);
}
function getItemProgress(state, id) {
  const item = state.queue.find((i) => i.id === id);
  return item?.progress;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getActiveImageProcessingCount,
  getActiveUploadCount,
  getAllItems,
  getBlobUrls,
  getFailedItems,
  getItem,
  getItemProgress,
  getPausedUploadForPost,
  getPendingImageProcessing,
  getPendingUploads,
  hasPendingItemsByParentId,
  isBatchUploaded,
  isPaused,
  isUploadingToPost
});
//# sourceMappingURL=private-selectors.cjs.map
