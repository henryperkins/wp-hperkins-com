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

// packages/fields/src/fields/template/index.ts
var template_exports = {};
__export(template_exports, {
  default: () => template_default
});
module.exports = __toCommonJS(template_exports);
var import_i18n = require("@wordpress/i18n");
var import_template_edit = require("./template-edit.cjs");
var import_template_view = require("./template-view.cjs");
var templateField = {
  id: "template",
  type: "text",
  label: (0, import_i18n.__)("Template"),
  Edit: import_template_edit.TemplateEdit,
  render: import_template_view.TemplateView,
  enableSorting: false,
  filterBy: false
};
var template_default = templateField;
//# sourceMappingURL=index.cjs.map
