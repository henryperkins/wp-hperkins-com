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

// packages/editor/src/components/post-trash/check.js
var check_exports = {};
__export(check_exports, {
  default: () => PostTrashCheck
});
module.exports = __toCommonJS(check_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_store = require("../../store/index.cjs");
var import_constants = require("../../store/constants.cjs");
function PostTrashCheck({ children }) {
  const { canTrashPost } = (0, import_data.useSelect)((select) => {
    const { isEditedPostNew, getCurrentPostId, getCurrentPostType } = select(import_store.store);
    const { canUser } = select(import_core_data.store);
    const postType = getCurrentPostType();
    const postId = getCurrentPostId();
    const isNew = isEditedPostNew();
    const canUserDelete = !!postId ? canUser("delete", {
      kind: "postType",
      name: postType,
      id: postId
    }) : false;
    return {
      canTrashPost: (!isNew || postId) && canUserDelete && !import_constants.GLOBAL_POST_TYPES.includes(postType)
    };
  }, []);
  if (!canTrashPost) {
    return null;
  }
  return children;
}
//# sourceMappingURL=check.cjs.map
