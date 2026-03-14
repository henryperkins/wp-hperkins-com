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

// packages/fields/src/fields/author/index.tsx
var author_exports = {};
__export(author_exports, {
  default: () => author_default
});
module.exports = __toCommonJS(author_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_author_view = __toESM(require("./author-view.cjs"));
var authorField = {
  label: (0, import_i18n.__)("Author"),
  id: "author",
  type: "integer",
  getElements: async () => {
    const authors = await (0, import_data.resolveSelect)(import_core_data.store).getEntityRecords(
      "root",
      "user",
      {
        per_page: -1,
        who: "authors",
        _fields: "id,name",
        context: "view"
      }
    ) ?? [];
    return authors.map(({ id, name }) => ({
      value: id,
      label: name
    }));
  },
  setValue: ({ value }) => ({ author: Number(value) }),
  render: import_author_view.default,
  sort: (a, b, direction) => {
    const nameA = a._embedded?.author?.[0]?.name || "";
    const nameB = b._embedded?.author?.[0]?.name || "";
    return direction === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  },
  filterBy: {
    operators: ["isAny", "isNone"]
  }
};
var author_default = authorField;
//# sourceMappingURL=index.cjs.map
