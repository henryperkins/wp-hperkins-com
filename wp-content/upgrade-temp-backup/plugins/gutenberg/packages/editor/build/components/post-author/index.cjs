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

// packages/editor/src/components/post-author/index.js
var post_author_exports = {};
__export(post_author_exports, {
  default: () => post_author_default
});
module.exports = __toCommonJS(post_author_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_combobox = __toESM(require("./combobox.cjs"));
var import_select = __toESM(require("./select.cjs"));
var import_constants = require("./constants.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var minimumUsersForCombobox = 25;
function PostAuthor() {
  const showCombobox = (0, import_data.useSelect)((select) => {
    const authors = select(import_core_data.store).getUsers(import_constants.AUTHORS_QUERY);
    return authors?.length >= minimumUsersForCombobox;
  }, []);
  if (showCombobox) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_combobox.default, {});
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_select.default, {});
}
var post_author_default = PostAuthor;
//# sourceMappingURL=index.cjs.map
