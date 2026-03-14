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

// packages/editor/src/store/local-autosave.js
var local_autosave_exports = {};
__export(local_autosave_exports, {
  localAutosaveClear: () => localAutosaveClear,
  localAutosaveGet: () => localAutosaveGet,
  localAutosaveSet: () => localAutosaveSet
});
module.exports = __toCommonJS(local_autosave_exports);
function postKey(postId, isPostNew) {
  return `wp-autosave-block-editor-post-${isPostNew ? "auto-draft" : postId}`;
}
function localAutosaveGet(postId, isPostNew) {
  return window.sessionStorage.getItem(postKey(postId, isPostNew));
}
function localAutosaveSet(postId, isPostNew, title, content, excerpt) {
  window.sessionStorage.setItem(
    postKey(postId, isPostNew),
    JSON.stringify({
      post_title: title,
      content,
      excerpt
    })
  );
}
function localAutosaveClear(postId, isPostNew) {
  window.sessionStorage.removeItem(postKey(postId, isPostNew));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  localAutosaveClear,
  localAutosaveGet,
  localAutosaveSet
});
//# sourceMappingURL=local-autosave.cjs.map
