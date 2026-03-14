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

// packages/global-styles-ui/src/font-library/lib/lib-font.browser.d.ts
var lib_font_browser_d_exports = {};
__export(lib_font_browser_d_exports, {
  Font: () => Font
});
module.exports = __toCommonJS(lib_font_browser_d_exports);
var Font = class {
  opentype;
  tables;
  onload;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Font
});
//# sourceMappingURL=lib-font.browser.d.cjs.map
