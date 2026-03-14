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

// packages/fields/src/fields/notes/index.tsx
var notes_exports = {};
__export(notes_exports, {
  default: () => notes_default
});
module.exports = __toCommonJS(notes_exports);
var import_i18n = require("@wordpress/i18n");
var notesField = {
  id: "notesCount",
  label: (0, import_i18n.__)("Notes"),
  type: "integer",
  enableSorting: false,
  filterBy: false
};
var notes_default = notesField;
//# sourceMappingURL=index.cjs.map
