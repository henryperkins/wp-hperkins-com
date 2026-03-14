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

// packages/editor/src/utils/media-upload/on-success.js
var on_success_exports = {};
__export(on_success_exports, {
  default: () => mediaUploadOnSuccess
});
module.exports = __toCommonJS(on_success_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
function mediaUploadOnSuccess(attachments) {
  const { invalidateResolution } = (0, import_data.dispatch)(import_core_data.store);
  for (const attachment of attachments) {
    if (attachment.id) {
      invalidateResolution("getEntityRecord", [
        "postType",
        "attachment",
        attachment.id,
        { context: "view" }
      ]);
      invalidateResolution("getEntityRecord", [
        "postType",
        "attachment",
        attachment.id
      ]);
    }
  }
}
//# sourceMappingURL=on-success.cjs.map
