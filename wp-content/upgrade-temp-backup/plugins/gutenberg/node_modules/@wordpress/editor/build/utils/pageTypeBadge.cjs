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

// packages/editor/src/utils/pageTypeBadge.js
var pageTypeBadge_exports = {};
__export(pageTypeBadge_exports, {
  default: () => usePageTypeBadge
});
module.exports = __toCommonJS(pageTypeBadge_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
function usePageTypeBadge(postId) {
  const { isFrontPage, isPostsPage } = (0, import_data.useSelect)((select) => {
    const { canUser, getEditedEntityRecord } = select(import_core_data.store);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    const _postId = parseInt(postId, 10);
    return {
      isFrontPage: siteSettings?.page_on_front === _postId,
      isPostsPage: siteSettings?.page_for_posts === _postId
    };
  });
  if (isFrontPage) {
    return (0, import_i18n.__)("Homepage");
  } else if (isPostsPage) {
    return (0, import_i18n.__)("Posts Page");
  }
  return false;
}
//# sourceMappingURL=pageTypeBadge.cjs.map
