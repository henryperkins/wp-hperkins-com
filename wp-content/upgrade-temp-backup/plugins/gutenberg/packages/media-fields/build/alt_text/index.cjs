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

// packages/media-fields/src/alt_text/index.tsx
var alt_text_exports = {};
__export(alt_text_exports, {
  default: () => alt_text_default
});
module.exports = __toCommonJS(alt_text_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
var altTextField = {
  id: "alt_text",
  type: "text",
  label: (0, import_i18n.__)("Alt text"),
  isVisible: (item) => item?.media_type === "image",
  render: ({ item }) => item?.alt_text || "-",
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.TextareaControl,
      {
        label: field.label,
        value: data.alt_text || "",
        onChange: (value) => onChange({ alt_text: value }),
        rows: 2
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var alt_text_default = altTextField;
//# sourceMappingURL=index.cjs.map
