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

// packages/editor/src/components/post-url/check.js
var check_exports = {};
__export(check_exports, {
  default: () => PostURLCheck
});
module.exports = __toCommonJS(check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
function PostURLCheck({ children }) {
  const isVisible = (0, import_data.useSelect)((select) => {
    const postTypeSlug = select(import_store.store).getCurrentPostType();
    const postType = select(import_core_data.store).getPostType(postTypeSlug);
    if (!postType?.viewable) {
      return false;
    }
    const post = select(import_store.store).getCurrentPost();
    if (!post.link) {
      return false;
    }
    const permalinkParts = select(import_store.store).getPermalinkParts();
    if (!permalinkParts) {
      return false;
    }
    return true;
  }, []);
  if (!isVisible) {
    return null;
  }
  return children;
}
//# sourceMappingURL=check.cjs.map
