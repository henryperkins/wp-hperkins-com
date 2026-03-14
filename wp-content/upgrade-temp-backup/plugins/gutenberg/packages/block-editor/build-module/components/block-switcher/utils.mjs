// packages/block-editor/src/components/block-switcher/utils.js
import { getBlockAttributesNamesByRole } from "@wordpress/blocks";
var getMatchingBlockByName = (block, selectedBlockName, consumedBlocks = /* @__PURE__ */ new Set()) => {
  const { clientId, name, innerBlocks = [] } = block;
  if (consumedBlocks.has(clientId)) {
    return;
  }
  if (name === selectedBlockName) {
    return block;
  }
  for (const innerBlock of innerBlocks) {
    const match = getMatchingBlockByName(
      innerBlock,
      selectedBlockName,
      consumedBlocks
    );
    if (match) {
      return match;
    }
  }
};
var getRetainedBlockAttributes = (name, attributes) => {
  const contentAttributes = getBlockAttributesNamesByRole(name, "content");
  if (!contentAttributes?.length) {
    return attributes;
  }
  return contentAttributes.reduce((_accumulator, attribute) => {
    if (attributes[attribute]) {
      _accumulator[attribute] = attributes[attribute];
    }
    return _accumulator;
  }, {});
};
export {
  getMatchingBlockByName,
  getRetainedBlockAttributes
};
//# sourceMappingURL=utils.mjs.map
