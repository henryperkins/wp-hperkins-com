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

// packages/media-fields/src/caption/index.tsx
var caption_exports = {};
__export(caption_exports, {
  default: () => caption_default
});
module.exports = __toCommonJS(caption_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_get_raw_content = require("../utils/get-raw-content.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var captionField = {
  id: "caption",
  type: "text",
  label: (0, import_i18n.__)("Caption"),
  getValue: ({ item }) => (0, import_get_raw_content.getRawContent)(item?.caption),
  render: ({ item }) => (0, import_get_raw_content.getRawContent)(item?.caption) || "-",
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.TextareaControl,
      {
        label: field.label,
        value: (0, import_get_raw_content.getRawContent)(data.caption) || "",
        onChange: (value) => onChange({ caption: value }),
        rows: 2
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var caption_default = captionField;
//# sourceMappingURL=index.cjs.map
