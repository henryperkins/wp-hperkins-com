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

// packages/editor/src/utils/media-upload/index.js
var media_upload_exports = {};
__export(media_upload_exports, {
  default: () => mediaUpload
});
module.exports = __toCommonJS(media_upload_exports);
var import_uuid = require("uuid");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_media_utils = require("@wordpress/media-utils");
var import_store = require("../../store/index.cjs");
var noop = () => {
};
function mediaUpload({
  additionalData = {},
  allowedTypes,
  filesList,
  maxUploadFileSize,
  onError = noop,
  onFileChange,
  onSuccess,
  multiple = true
}) {
  const { receiveEntityRecords } = (0, import_data.dispatch)(import_core_data.store);
  const { getCurrentPost, getEditorSettings } = (0, import_data.select)(import_store.store);
  const {
    lockPostAutosaving,
    unlockPostAutosaving,
    lockPostSaving,
    unlockPostSaving
  } = (0, import_data.dispatch)(import_store.store);
  const wpAllowedMimeTypes = getEditorSettings().allowedMimeTypes;
  const lockKey = `image-upload-${(0, import_uuid.v4)()}`;
  let imageIsUploading = false;
  maxUploadFileSize = maxUploadFileSize || getEditorSettings().maxUploadFileSize;
  const currentPost = getCurrentPost();
  const currentPostId = typeof currentPost?.id === "number" ? currentPost.id : currentPost?.wp_id;
  const setSaveLock = () => {
    if (window.__clientSideMediaProcessing) {
      return;
    }
    lockPostSaving(lockKey);
    lockPostAutosaving(lockKey);
    imageIsUploading = true;
  };
  const postData = currentPostId ? { post: currentPostId } : {};
  const clearSaveLock = () => {
    if (window.__clientSideMediaProcessing) {
      return;
    }
    unlockPostSaving(lockKey);
    unlockPostAutosaving(lockKey);
    imageIsUploading = false;
  };
  (0, import_media_utils.uploadMedia)({
    allowedTypes,
    filesList,
    onFileChange: (file) => {
      if (!window.__clientSideMediaProcessing) {
        if (!imageIsUploading) {
          setSaveLock();
        } else {
          clearSaveLock();
        }
      }
      onFileChange?.(file);
      const entityFiles = file.filter((_file) => _file?.id);
      if (entityFiles?.length) {
        const invalidateCache = true;
        receiveEntityRecords(
          "postType",
          "attachment",
          entityFiles,
          void 0,
          invalidateCache
        );
      }
    },
    onSuccess,
    additionalData: {
      ...postData,
      ...additionalData
    },
    maxUploadFileSize,
    onError: ({ message }) => {
      if (!window.__clientSideMediaProcessing) {
        clearSaveLock();
      }
      onError(message);
    },
    wpAllowedMimeTypes,
    multiple
  });
}
//# sourceMappingURL=index.cjs.map
