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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/media-utils/src/index.ts
var index_exports = {};
__export(index_exports, {
  privateApis: () => import_private_apis.privateApis,
  transformAttachment: () => import_transform_attachment.transformAttachment,
  uploadMedia: () => import_upload_media.uploadMedia,
  validateFileSize: () => import_validate_file_size.validateFileSize,
  validateMimeType: () => import_validate_mime_type.validateMimeType,
  validateMimeTypeForUser: () => import_validate_mime_type_for_user.validateMimeTypeForUser
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("./components/index.cjs"), module.exports);
var import_upload_media = require("./utils/upload-media.cjs");
var import_transform_attachment = require("./utils/transform-attachment.cjs");
var import_validate_file_size = require("./utils/validate-file-size.cjs");
var import_validate_mime_type = require("./utils/validate-mime-type.cjs");
var import_validate_mime_type_for_user = require("./utils/validate-mime-type-for-user.cjs");
var import_private_apis = require("./private-apis.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis,
  transformAttachment,
  uploadMedia,
  validateFileSize,
  validateMimeType,
  validateMimeTypeForUser,
  ...require("./components/index.cjs")
});
//# sourceMappingURL=index.cjs.map
