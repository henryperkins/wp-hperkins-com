// packages/editor/src/store/local-autosave.js
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
export {
  localAutosaveClear,
  localAutosaveGet,
  localAutosaveSet
};
//# sourceMappingURL=local-autosave.mjs.map
