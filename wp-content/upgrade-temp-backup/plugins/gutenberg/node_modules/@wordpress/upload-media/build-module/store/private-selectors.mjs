// packages/upload-media/src/store/private-selectors.ts
import {
  ItemStatus,
  OperationType
} from "./types.mjs";
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
    (item) => item.currentOperation === OperationType.Upload && item.additionalData.post === postOrAttachmentId
  );
}
function getPausedUploadForPost(state, postOrAttachmentId) {
  return state.queue.find(
    (item) => item.status === ItemStatus.Paused && item.additionalData.post === postOrAttachmentId
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
    (item) => item.currentOperation === OperationType.Upload
  ).length;
}
function getPendingUploads(state) {
  return state.queue.filter((item) => {
    const nextOperation = Array.isArray(item.operations?.[0]) ? item.operations[0][0] : item.operations?.[0];
    return nextOperation === OperationType.Upload && item.currentOperation !== OperationType.Upload;
  });
}
function getActiveImageProcessingCount(state) {
  return state.queue.filter(
    (item) => item.currentOperation === OperationType.ResizeCrop || item.currentOperation === OperationType.Rotate
  ).length;
}
function getPendingImageProcessing(state) {
  return state.queue.filter((item) => {
    const nextOperation = Array.isArray(item.operations?.[0]) ? item.operations[0][0] : item.operations?.[0];
    return (nextOperation === OperationType.ResizeCrop || nextOperation === OperationType.Rotate) && item.currentOperation !== OperationType.ResizeCrop && item.currentOperation !== OperationType.Rotate;
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
export {
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
};
//# sourceMappingURL=private-selectors.mjs.map
