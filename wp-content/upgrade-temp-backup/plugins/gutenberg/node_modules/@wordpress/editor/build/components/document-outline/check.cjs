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

// packages/editor/src/components/document-outline/check.js
var check_exports = {};
__export(check_exports, {
  default: () => DocumentOutlineCheck
});
module.exports = __toCommonJS(check_exports);
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
function DocumentOutlineCheck({ children }) {
  const hasHeadings = (0, import_data.useSelect)((select) => {
    const { getGlobalBlockCount } = select(import_block_editor.store);
    return getGlobalBlockCount("core/heading") > 0;
  });
  if (!hasHeadings) {
    return null;
  }
  return children;
}
//# sourceMappingURL=check.cjs.map
