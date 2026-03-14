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

// packages/media-fields/src/utils/get-raw-content.ts
var get_raw_content_exports = {};
__export(get_raw_content_exports, {
  getRawContent: () => getRawContent
});
module.exports = __toCommonJS(get_raw_content_exports);
function getRawContent(content) {
  if (!content) {
    return "";
  }
  if (typeof content === "string") {
    return content;
  }
  if (typeof content === "object" && "raw" in content) {
    return content.raw || "";
  }
  return "";
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getRawContent
});
//# sourceMappingURL=get-raw-content.cjs.map
