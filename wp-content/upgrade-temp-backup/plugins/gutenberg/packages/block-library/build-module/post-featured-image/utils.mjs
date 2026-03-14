// packages/block-library/src/post-featured-image/utils.js
function dimRatioToClass(ratio) {
  return ratio === void 0 ? null : "has-background-dim-" + 10 * Math.round(ratio / 10);
}
export {
  dimRatioToClass
};
//# sourceMappingURL=utils.mjs.map
