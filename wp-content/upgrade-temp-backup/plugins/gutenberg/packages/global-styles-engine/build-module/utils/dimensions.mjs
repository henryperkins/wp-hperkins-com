// packages/global-styles-engine/src/utils/dimensions.ts
function getDimensionPresetCssVar(value) {
  if (!value) {
    return;
  }
  const slug = value.match(/var:preset\|dimension\|(.+)/);
  if (!slug) {
    return value;
  }
  return `var(--wp--preset--dimension--${slug[1]})`;
}
export {
  getDimensionPresetCssVar
};
//# sourceMappingURL=dimensions.mjs.map
