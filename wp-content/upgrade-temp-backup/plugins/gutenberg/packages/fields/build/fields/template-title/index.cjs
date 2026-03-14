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

// packages/fields/src/fields/template-title/index.ts
var template_title_exports = {};
__export(template_title_exports, {
  default: () => template_title_default
});
module.exports = __toCommonJS(template_title_exports);
var import_i18n = require("@wordpress/i18n");
var import_utils = require("../../actions/utils.cjs");
var import_view = __toESM(require("../title/view.cjs"));
var templateTitleField = {
  type: "text",
  label: (0, import_i18n.__)("Template"),
  placeholder: (0, import_i18n.__)("No title"),
  id: "title",
  getValue: ({ item }) => (0, import_utils.getItemTitle)(item),
  render: import_view.default,
  enableHiding: false,
  enableGlobalSearch: true,
  filterBy: false
};
var template_title_default = templateTitleField;
//# sourceMappingURL=index.cjs.map
