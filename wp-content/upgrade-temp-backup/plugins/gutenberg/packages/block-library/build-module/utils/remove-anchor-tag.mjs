// packages/block-library/src/utils/remove-anchor-tag.js
function removeAnchorTag(value) {
  return value.toString().replace(/<\/?a[^>]*>/g, "");
}
export {
  removeAnchorTag as default
};
//# sourceMappingURL=remove-anchor-tag.mjs.map
