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

// packages/fields/src/fields/comment-status/index.tsx
var comment_status_exports = {};
__export(comment_status_exports, {
  default: () => comment_status_default
});
module.exports = __toCommonJS(comment_status_exports);
var import_i18n = require("@wordpress/i18n");
var commentStatusField = {
  id: "comment_status",
  label: (0, import_i18n.__)("Comments"),
  type: "text",
  Edit: "radio",
  enableSorting: false,
  enableHiding: false,
  filterBy: false,
  elements: [
    {
      value: "open",
      label: (0, import_i18n.__)("Open"),
      description: (0, import_i18n.__)("Visitors can add new comments and replies.")
    },
    {
      value: "closed",
      label: (0, import_i18n.__)("Closed"),
      description: (0, import_i18n.__)(
        "Visitors cannot add new comments or replies. Existing comments remain visible."
      )
    }
  ]
};
var comment_status_default = commentStatusField;
//# sourceMappingURL=index.cjs.map
