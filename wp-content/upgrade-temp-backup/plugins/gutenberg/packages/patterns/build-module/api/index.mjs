// packages/patterns/src/api/index.js
function isOverridableBlock(block) {
  return !!block.attributes.metadata?.name && !!block.attributes.metadata?.bindings && Object.values(block.attributes.metadata.bindings).some(
    (binding) => binding.source === "core/pattern-overrides"
  );
}
export {
  isOverridableBlock
};
//# sourceMappingURL=index.mjs.map
