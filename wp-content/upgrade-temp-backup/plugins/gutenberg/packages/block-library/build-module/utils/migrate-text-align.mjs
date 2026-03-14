// packages/block-library/src/utils/migrate-text-align.js
function migrate_text_align_default(attributes) {
  const { textAlign, ...restAttributes } = attributes;
  if (!textAlign) {
    return attributes;
  }
  return {
    ...restAttributes,
    style: {
      ...attributes.style,
      typography: {
        ...attributes.style?.typography,
        textAlign
      }
    }
  };
}
export {
  migrate_text_align_default as default
};
//# sourceMappingURL=migrate-text-align.mjs.map
