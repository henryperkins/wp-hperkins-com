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

// packages/editor/src/components/list-view-sidebar/list-view-outline.js
var list_view_outline_exports = {};
__export(list_view_outline_exports, {
  default: () => ListViewOutline
});
module.exports = __toCommonJS(list_view_outline_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_character_count = __toESM(require("../character-count/index.cjs"));
var import_word_count = __toESM(require("../word-count/index.cjs"));
var import_time_to_read = __toESM(require("../time-to-read/index.cjs"));
var import_document_outline = __toESM(require("../document-outline/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function ListViewOutline() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "editor-list-view-sidebar__outline", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Characters:") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_character_count.default, {}) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Words:") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_word_count.default, {})
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.__)("Time to read:") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_time_to_read.default, {})
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_document_outline.default, {})
  ] });
}
//# sourceMappingURL=list-view-outline.cjs.map
