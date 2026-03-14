// packages/block-library/src/utils/is-block-metadata-experimental.js
function isBlockMetadataExperimental(metadata) {
  return metadata && "__experimental" in metadata && metadata.__experimental !== false;
}
export {
  isBlockMetadataExperimental as default
};
//# sourceMappingURL=is-block-metadata-experimental.mjs.map
