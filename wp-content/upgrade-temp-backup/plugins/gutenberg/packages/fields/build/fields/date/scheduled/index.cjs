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

// packages/fields/src/fields/date/scheduled/index.tsx
var scheduled_exports = {};
__export(scheduled_exports, {
  default: () => scheduled_default
});
module.exports = __toCommonJS(scheduled_exports);
var import_i18n = require("@wordpress/i18n");
var scheduledDateField = {
  id: "scheduled_date",
  type: "datetime",
  label: (0, import_i18n.__)("Scheduled Date"),
  getValue: ({ item }) => item.date,
  setValue: ({ value }) => ({ date: value }),
  isVisible: (item) => item.status === "future",
  enableHiding: false,
  enableSorting: false,
  filterBy: false
};
var scheduled_default = scheduledDateField;
//# sourceMappingURL=index.cjs.map
