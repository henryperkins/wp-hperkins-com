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

// packages/media-utils/src/utils/upload-media.ts
var upload_media_exports = {};
__export(upload_media_exports, {
  uploadMedia: () => uploadMedia
});
module.exports = __toCommonJS(upload_media_exports);
var import_i18n = require("@wordpress/i18n");
var import_blob = require("@wordpress/blob");
var import_upload_to_server = require("./upload-to-server.cjs");
var import_validate_mime_type = require("./validate-mime-type.cjs");
var import_validate_mime_type_for_user = require("./validate-mime-type-for-user.cjs");
var import_validate_file_size = require("./validate-file-size.cjs");
var import_upload_error = require("./upload-error.cjs");
function uploadMedia({
  wpAllowedMimeTypes,
  allowedTypes,
  additionalData = {},
  filesList,
  maxUploadFileSize,
  onError,
  onFileChange,
  signal,
  multiple = true
}) {
  if (!multiple && filesList.length > 1) {
    onError?.(new Error((0, import_i18n.__)("Only one file can be used here.")));
    return;
  }
  const validFiles = [];
  const filesSet = [];
  const setAndUpdateFiles = (index, value) => {
    if (!window.__clientSideMediaProcessing) {
      if (filesSet[index]?.url) {
        (0, import_blob.revokeBlobURL)(filesSet[index].url);
      }
    }
    filesSet[index] = value;
    onFileChange?.(
      filesSet.filter((attachment) => attachment !== null)
    );
  };
  for (const mediaFile of filesList) {
    try {
      (0, import_validate_mime_type_for_user.validateMimeTypeForUser)(mediaFile, wpAllowedMimeTypes);
    } catch (error) {
      onError?.(error);
      continue;
    }
    try {
      (0, import_validate_mime_type.validateMimeType)(mediaFile, allowedTypes);
    } catch (error) {
      onError?.(error);
      continue;
    }
    try {
      (0, import_validate_file_size.validateFileSize)(mediaFile, maxUploadFileSize);
    } catch (error) {
      onError?.(error);
      continue;
    }
    validFiles.push(mediaFile);
    if (!window.__clientSideMediaProcessing) {
      filesSet.push({ url: (0, import_blob.createBlobURL)(mediaFile) });
      onFileChange?.(filesSet);
    }
  }
  validFiles.map(async (file, index) => {
    try {
      const attachment = await (0, import_upload_to_server.uploadToServer)(
        file,
        additionalData,
        signal
      );
      setAndUpdateFiles(index, attachment);
    } catch (error) {
      setAndUpdateFiles(index, null);
      let message;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = typeof error.message === "string" ? error.message : String(error.message);
      } else {
        message = (0, import_i18n.sprintf)(
          // translators: %s: file name
          (0, import_i18n.__)("Error while uploading file %s to the media library."),
          file.name
        );
      }
      onError?.(
        new import_upload_error.UploadError({
          code: "GENERAL",
          message,
          file,
          cause: error instanceof Error ? error : void 0
        })
      );
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  uploadMedia
});
//# sourceMappingURL=upload-media.cjs.map
