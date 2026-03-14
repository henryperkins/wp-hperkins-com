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

// packages/media-fields/src/description/index.tsx
var description_exports = {};
__export(description_exports, {
  default: () => description_default
});
module.exports = __toCommonJS(description_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_get_raw_content = require("../utils/get-raw-content.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var descriptionField = {
  id: "description",
  type: "text",
  label: (0, import_i18n.__)("Description"),
  getValue: ({ item }) => (0, import_get_raw_content.getRawContent)(item?.description),
  render: ({ item }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: (0, import_get_raw_content.getRawContent)(item?.description) || "-" }),
  Edit: ({ field, onChange, data }) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.TextareaControl,
      {
        label: field.label,
        value: (0, import_get_raw_content.getRawContent)(data.description) || "",
        onChange: (value) => onChange({ description: value }),
        rows: 5
      }
    );
  },
  enableSorting: false,
  filterBy: false
};
var description_default = descriptionField;
//# sourceMappingURL=index.cjs.map
