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

// packages/editor/src/components/post-author/constants.js
var constants_exports = {};
__export(constants_exports, {
  AUTHORS_QUERY: () => AUTHORS_QUERY,
  BASE_QUERY: () => BASE_QUERY
});
module.exports = __toCommonJS(constants_exports);
var BASE_QUERY = {
  _fields: "id,name",
  context: "view"
  // Allows non-admins to perform requests.
};
var AUTHORS_QUERY = {
  who: "authors",
  per_page: 100,
  ...BASE_QUERY
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AUTHORS_QUERY,
  BASE_QUERY
});
//# sourceMappingURL=constants.cjs.map
