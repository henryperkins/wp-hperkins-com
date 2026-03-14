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

// packages/media-fields/src/date_added/index.tsx
var date_added_exports = {};
__export(date_added_exports, {
  default: () => date_added_default
});
module.exports = __toCommonJS(date_added_exports);
var import_i18n = require("@wordpress/i18n");
var import_date = require("@wordpress/date");
var dateAddedField = {
  id: "date",
  type: "datetime",
  label: (0, import_i18n.__)("Date added"),
  filterBy: {
    operators: ["before", "after"]
  },
  format: {
    datetime: (0, import_date.getSettings)().formats.datetimeAbbreviated
  },
  readOnly: true
};
var date_added_default = dateAddedField;
//# sourceMappingURL=index.cjs.map
