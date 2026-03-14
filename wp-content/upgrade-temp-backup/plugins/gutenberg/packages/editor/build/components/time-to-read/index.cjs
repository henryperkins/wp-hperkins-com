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

// packages/editor/src/components/time-to-read/index.js
var time_to_read_exports = {};
__export(time_to_read_exports, {
  default: () => TimeToRead
});
module.exports = __toCommonJS(time_to_read_exports);
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_wordcount = require("@wordpress/wordcount");
var import_element = require("@wordpress/element");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var AVERAGE_READING_RATE = 189;
function TimeToRead() {
  const content = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditedPostAttribute("content"),
    []
  );
  const wordCountType = (0, import_i18n._x)("words", "Word count type. Do not translate!");
  const minutesToRead = Math.round(
    (0, import_wordcount.count)(content, wordCountType) / AVERAGE_READING_RATE
  );
  const minutesToReadString = minutesToRead === 0 ? (0, import_element.createInterpolateElement)((0, import_i18n.__)("<span>< 1</span> minute"), {
    span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
  }) : (0, import_element.createInterpolateElement)(
    (0, import_i18n.sprintf)(
      /* translators: %s: the number of minutes to read the post. */
      (0, import_i18n._n)(
        "<span>%s</span> minute",
        "<span>%s</span> minutes",
        minutesToRead
      ),
      minutesToRead
    ),
    {
      span: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "time-to-read", children: minutesToReadString });
}
//# sourceMappingURL=index.cjs.map
