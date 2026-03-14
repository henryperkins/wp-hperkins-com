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

// packages/editor/src/components/word-count/index.js
var word_count_exports = {};
__export(word_count_exports, {
  default: () => WordCount
});
module.exports = __toCommonJS(word_count_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_wordcount = require("@wordpress/wordcount");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function WordCount() {
  const content = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("content"),
    []
  );
  const wordCountType = (0, import_i18n._x)("words", "Word count type. Do not translate!");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "word-count", children: (0, import_wordcount.count)(content, wordCountType) });
}
//# sourceMappingURL=index.cjs.map
