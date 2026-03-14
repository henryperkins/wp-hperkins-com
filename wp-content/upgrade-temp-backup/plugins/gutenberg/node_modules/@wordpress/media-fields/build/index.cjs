"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/media-fields/src/index.ts
var index_exports = {};
__export(index_exports, {
  altTextField: () => import_alt_text.default,
  attachedToField: () => import_attached_to.default,
  authorField: () => import_author.default,
  captionField: () => import_caption.default,
  dateAddedField: () => import_date_added.default,
  dateModifiedField: () => import_date_modified.default,
  descriptionField: () => import_description.default,
  filenameField: () => import_filename.default,
  filesizeField: () => import_filesize.default,
  mediaDimensionsField: () => import_media_dimensions.default,
  mediaThumbnailField: () => import_media_thumbnail.default,
  mimeTypeField: () => import_mime_type.default
});
module.exports = __toCommonJS(index_exports);
var import_alt_text = __toESM(require("./alt_text/index.cjs"));
var import_attached_to = __toESM(require("./attached_to/index.cjs"));
var import_author = __toESM(require("./author/index.cjs"));
var import_caption = __toESM(require("./caption/index.cjs"));
var import_date_added = __toESM(require("./date_added/index.cjs"));
var import_date_modified = __toESM(require("./date_modified/index.cjs"));
var import_description = __toESM(require("./description/index.cjs"));
var import_filename = __toESM(require("./filename/index.cjs"));
var import_filesize = __toESM(require("./filesize/index.cjs"));
var import_media_dimensions = __toESM(require("./media_dimensions/index.cjs"));
var import_media_thumbnail = __toESM(require("./media_thumbnail/index.cjs"));
var import_mime_type = __toESM(require("./mime_type/index.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  altTextField,
  attachedToField,
  authorField,
  captionField,
  dateAddedField,
  dateModifiedField,
  descriptionField,
  filenameField,
  filesizeField,
  mediaDimensionsField,
  mediaThumbnailField,
  mimeTypeField
});
//# sourceMappingURL=index.cjs.map
