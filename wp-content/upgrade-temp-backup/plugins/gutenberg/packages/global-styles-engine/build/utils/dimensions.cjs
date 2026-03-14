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

// packages/global-styles-engine/src/utils/dimensions.ts
var dimensions_exports = {};
__export(dimensions_exports, {
  getDimensionPresetCssVar: () => getDimensionPresetCssVar
});
module.exports = __toCommonJS(dimensions_exports);
function getDimensionPresetCssVar(value) {
  if (!value) {
    return;
  }
  const slug = value.match(/var:preset\|dimension\|(.+)/);
  if (!slug) {
    return value;
  }
  return `var(--wp--preset--dimension--${slug[1]})`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDimensionPresetCssVar
});
//# sourceMappingURL=dimensions.cjs.map
