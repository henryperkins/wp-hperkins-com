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

// packages/editor/src/components/provider/use-upload-save-lock.js
var use_upload_save_lock_exports = {};
__export(use_upload_save_lock_exports, {
  default: () => useUploadSaveLock
});
module.exports = __toCommonJS(use_upload_save_lock_exports);
var import_data = require("@wordpress/data");
var import_element = require("@wordpress/element");
var import_upload_media = require("@wordpress/upload-media");
var import_store = require("../../store/index.cjs");
var LOCK_NAME = "upload-in-progress";
function useUploadSaveLock() {
  const isClientSideMediaProcessingEnabled = window.__clientSideMediaProcessing;
  const isUploading = (0, import_data.useSelect)(
    (select) => {
      if (!isClientSideMediaProcessingEnabled) {
        return false;
      }
      return select(import_upload_media.store).isUploading();
    },
    [isClientSideMediaProcessingEnabled]
  );
  const {
    lockPostSaving,
    unlockPostSaving,
    lockPostAutosaving,
    unlockPostAutosaving
  } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    if (!isClientSideMediaProcessingEnabled) {
      return;
    }
    if (isUploading) {
      lockPostSaving(LOCK_NAME);
      lockPostAutosaving(LOCK_NAME);
    } else {
      unlockPostSaving(LOCK_NAME);
      unlockPostAutosaving(LOCK_NAME);
    }
    return () => {
      unlockPostSaving(LOCK_NAME);
      unlockPostAutosaving(LOCK_NAME);
    };
  }, [
    isClientSideMediaProcessingEnabled,
    isUploading,
    lockPostSaving,
    unlockPostSaving,
    lockPostAutosaving,
    unlockPostAutosaving
  ]);
}
//# sourceMappingURL=use-upload-save-lock.cjs.map
