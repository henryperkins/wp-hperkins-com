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

// packages/fields/src/actions/index.ts
var actions_exports = {};
__export(actions_exports, {
  deletePost: () => import_delete_post.default,
  duplicatePattern: () => import_duplicate_pattern.default,
  duplicatePost: () => import_duplicate_post.default,
  duplicateTemplatePart: () => import_duplicate_template_part.default,
  exportPattern: () => import_export_pattern.default,
  permanentlyDeletePost: () => import_permanently_delete_post.default,
  renamePost: () => import_rename_post.default,
  reorderPage: () => import_reorder_page.default,
  resetPost: () => import_reset_post.default,
  restorePost: () => import_restore_post.default,
  trashPost: () => import_trash_post.default,
  viewPost: () => import_view_post.default,
  viewPostRevisions: () => import_view_post_revisions.default
});
module.exports = __toCommonJS(actions_exports);
var import_view_post = __toESM(require("./view-post.cjs"));
var import_reorder_page = __toESM(require("./reorder-page.cjs"));
var import_duplicate_post = __toESM(require("./duplicate-post.cjs"));
var import_rename_post = __toESM(require("./rename-post.cjs"));
var import_reset_post = __toESM(require("./reset-post.cjs"));
var import_duplicate_pattern = __toESM(require("./duplicate-pattern.cjs"));
var import_export_pattern = __toESM(require("./export-pattern.cjs"));
var import_view_post_revisions = __toESM(require("./view-post-revisions.cjs"));
var import_permanently_delete_post = __toESM(require("./permanently-delete-post.cjs"));
var import_restore_post = __toESM(require("./restore-post.cjs"));
var import_trash_post = __toESM(require("./trash-post.cjs"));
var import_delete_post = __toESM(require("./delete-post.cjs"));
var import_duplicate_template_part = __toESM(require("./duplicate-template-part.cjs"));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  deletePost,
  duplicatePattern,
  duplicatePost,
  duplicateTemplatePart,
  exportPattern,
  permanentlyDeletePost,
  renamePost,
  reorderPage,
  resetPost,
  restorePost,
  trashPost,
  viewPost,
  viewPostRevisions
});
//# sourceMappingURL=index.cjs.map
