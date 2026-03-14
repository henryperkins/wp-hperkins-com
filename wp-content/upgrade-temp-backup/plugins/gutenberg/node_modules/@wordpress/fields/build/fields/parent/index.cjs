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

// packages/fields/src/fields/parent/index.ts
var parent_exports = {};
__export(parent_exports, {
  default: () => parent_default
});
module.exports = __toCommonJS(parent_exports);
var import_i18n = require("@wordpress/i18n");
var import_parent_edit = require("./parent-edit.cjs");
var import_parent_view = require("./parent-view.cjs");
var parentField = {
  id: "parent",
  type: "text",
  label: (0, import_i18n.__)("Parent"),
  Edit: import_parent_edit.ParentEdit,
  render: import_parent_view.ParentView,
  enableSorting: true,
  filterBy: false
};
var parent_default = parentField;
//# sourceMappingURL=index.cjs.map
