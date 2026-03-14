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

// packages/block-editor/src/components/media-upload-progress/constants.js
var constants_exports = {};
__export(constants_exports, {
  MEDIA_UPLOAD_STATE_FAILED: () => MEDIA_UPLOAD_STATE_FAILED,
  MEDIA_UPLOAD_STATE_IDLE: () => MEDIA_UPLOAD_STATE_IDLE,
  MEDIA_UPLOAD_STATE_PAUSED: () => MEDIA_UPLOAD_STATE_PAUSED,
  MEDIA_UPLOAD_STATE_RESET: () => MEDIA_UPLOAD_STATE_RESET,
  MEDIA_UPLOAD_STATE_SUCCEEDED: () => MEDIA_UPLOAD_STATE_SUCCEEDED,
  MEDIA_UPLOAD_STATE_UPLOADING: () => MEDIA_UPLOAD_STATE_UPLOADING
});
module.exports = __toCommonJS(constants_exports);
var MEDIA_UPLOAD_STATE_IDLE = 0;
var MEDIA_UPLOAD_STATE_UPLOADING = 1;
var MEDIA_UPLOAD_STATE_SUCCEEDED = 2;
var MEDIA_UPLOAD_STATE_FAILED = 3;
var MEDIA_UPLOAD_STATE_RESET = 4;
var MEDIA_UPLOAD_STATE_PAUSED = 11;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MEDIA_UPLOAD_STATE_FAILED,
  MEDIA_UPLOAD_STATE_IDLE,
  MEDIA_UPLOAD_STATE_PAUSED,
  MEDIA_UPLOAD_STATE_RESET,
  MEDIA_UPLOAD_STATE_SUCCEEDED,
  MEDIA_UPLOAD_STATE_UPLOADING
});
//# sourceMappingURL=constants.cjs.map
