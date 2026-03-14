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

// packages/upload-media/src/store/actions.ts
var actions_exports = {};
__export(actions_exports, {
  addItems: () => addItems,
  cancelItem: () => cancelItem,
  retryItem: () => retryItem
});
module.exports = __toCommonJS(actions_exports);
var import_uuid = require("uuid");
var import_types = require("./types.cjs");
var import_utils = require("./utils/index.cjs");
var import_validate_mime_type = require("../validate-mime-type.cjs");
var import_validate_mime_type_for_user = require("../validate-mime-type-for-user.cjs");
var import_validate_file_size = require("../validate-file-size.cjs");
function addItems({
  files,
  onChange,
  onSuccess,
  onError,
  onBatchSuccess,
  additionalData,
  allowedTypes
}) {
  return async ({ select, dispatch }) => {
    const batchId = (0, import_uuid.v4)();
    for (const file of files) {
      try {
        (0, import_validate_mime_type.validateMimeType)(file, allowedTypes);
        (0, import_validate_mime_type_for_user.validateMimeTypeForUser)(
          file,
          select.getSettings().allowedMimeTypes
        );
      } catch (error) {
        onError?.(error);
        continue;
      }
      try {
        (0, import_validate_file_size.validateFileSize)(
          file,
          select.getSettings().maxUploadFileSize
        );
      } catch (error) {
        onError?.(error);
        continue;
      }
      dispatch.addItem({
        file,
        batchId,
        onChange,
        onSuccess,
        onBatchSuccess,
        onError,
        additionalData
      });
    }
  };
}
function cancelItem(id, error, silent = false) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    item.abortController?.abort();
    await (0, import_utils.vipsCancelOperations)(id);
    if (!silent) {
      const { onError } = item;
      onError?.(error ?? new Error("Upload cancelled"));
      if (!onError && error) {
        console.error("Upload cancelled", error);
      }
    }
    dispatch({
      type: import_types.Type.Cancel,
      id,
      error
    });
    dispatch.removeItem(id);
    dispatch.revokeBlobUrls(id);
    if (item.batchId && select.isBatchUploaded(item.batchId)) {
      item.onBatchSuccess?.();
    }
  };
}
function retryItem(id) {
  return async ({ select, dispatch }) => {
    const item = select.getItem(id);
    if (!item) {
      return;
    }
    if (!item.error) {
      return;
    }
    dispatch({
      type: import_types.Type.RetryItem,
      id
    });
    dispatch.processItem(id);
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  addItems,
  cancelItem,
  retryItem
});
//# sourceMappingURL=actions.cjs.map
