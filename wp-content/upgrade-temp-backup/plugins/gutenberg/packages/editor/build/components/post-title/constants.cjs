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

// packages/editor/src/components/post-title/constants.js
var constants_exports = {};
__export(constants_exports, {
  DEFAULT_CLASSNAMES: () => DEFAULT_CLASSNAMES,
  REGEXP_NEWLINES: () => REGEXP_NEWLINES
});
module.exports = __toCommonJS(constants_exports);
var DEFAULT_CLASSNAMES = "wp-block wp-block-post-title block-editor-block-list__block editor-post-title editor-post-title__input rich-text";
var REGEXP_NEWLINES = /[\r\n]+/g;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_CLASSNAMES,
  REGEXP_NEWLINES
});
//# sourceMappingURL=constants.cjs.map
