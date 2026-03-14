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

// packages/block-editor/src/components/link-picker/index.js
var link_picker_exports = {};
__export(link_picker_exports, {
  LinkPicker: () => import_link_picker.LinkPicker
});
module.exports = __toCommonJS(link_picker_exports);
var import_link_picker = require("./link-picker.cjs");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LinkPicker
});
//# sourceMappingURL=index.cjs.map
