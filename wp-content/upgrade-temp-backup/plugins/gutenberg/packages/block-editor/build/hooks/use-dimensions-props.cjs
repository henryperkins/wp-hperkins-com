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

// packages/block-editor/src/hooks/use-dimensions-props.js
var use_dimensions_props_exports = {};
__export(use_dimensions_props_exports, {
  getDimensionsClassesAndStyles: () => getDimensionsClassesAndStyles
});
module.exports = __toCommonJS(use_dimensions_props_exports);
var import_style = require("./style.cjs");
function getDimensionsClassesAndStyles(attributes) {
  const { style } = attributes;
  const dimensionsStyles = style?.dimensions || {};
  const styleProp = (0, import_style.getInlineStyles)({ dimensions: dimensionsStyles });
  return {
    className: dimensionsStyles.aspectRatio ? "has-aspect-ratio" : void 0,
    style: styleProp
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getDimensionsClassesAndStyles
});
//# sourceMappingURL=use-dimensions-props.cjs.map
