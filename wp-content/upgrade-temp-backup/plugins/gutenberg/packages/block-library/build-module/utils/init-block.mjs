// packages/block-library/src/utils/init-block.js
import { registerBlockType } from "@wordpress/blocks";
function initBlock(block) {
  if (!block) {
    return;
  }
  const { metadata, settings, name } = block;
  return registerBlockType({ name, ...metadata }, settings);
}
export {
  initBlock as default
};
//# sourceMappingURL=init-block.mjs.map
