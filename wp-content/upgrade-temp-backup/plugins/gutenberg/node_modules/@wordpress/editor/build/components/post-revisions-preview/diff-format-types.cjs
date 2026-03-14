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

// packages/editor/src/components/post-revisions-preview/diff-format-types.js
var diff_format_types_exports = {};
__export(diff_format_types_exports, {
  registerDiffFormatTypes: () => registerDiffFormatTypes,
  unregisterDiffFormatTypes: () => unregisterDiffFormatTypes
});
module.exports = __toCommonJS(diff_format_types_exports);
var import_i18n = require("@wordpress/i18n");
var import_rich_text = require("@wordpress/rich-text");
var DIFF_FORMAT_TYPES = [
  {
    name: "revision/diff-removed",
    title: (0, import_i18n.__)("Removed"),
    tagName: "del",
    className: "revision-diff-removed"
  },
  {
    name: "revision/diff-added",
    title: (0, import_i18n.__)("Added"),
    tagName: "ins",
    className: "revision-diff-added"
  },
  {
    name: "revision/diff-format-added",
    title: (0, import_i18n.__)("Format added"),
    tagName: "span",
    className: "revision-diff-format-added"
  },
  {
    name: "revision/diff-format-removed",
    title: (0, import_i18n.__)("Format removed"),
    tagName: "span",
    className: "revision-diff-format-removed"
  },
  {
    name: "revision/diff-format-changed",
    title: (0, import_i18n.__)("Format changed"),
    tagName: "span",
    className: "revision-diff-format-changed"
  }
];
function registerDiffFormatTypes() {
  for (const formatType of DIFF_FORMAT_TYPES) {
    (0, import_rich_text.registerFormatType)(formatType.name, {
      ...formatType,
      attributes: { title: "title" },
      edit: () => null
    });
  }
}
function unregisterDiffFormatTypes() {
  for (const formatType of DIFF_FORMAT_TYPES) {
    (0, import_rich_text.unregisterFormatType)(formatType.name);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerDiffFormatTypes,
  unregisterDiffFormatTypes
});
//# sourceMappingURL=diff-format-types.cjs.map
