// packages/block-library/src/list-item/transforms.js
import { createBlock, cloneBlock } from "@wordpress/blocks";
var transforms = {
  to: [
    {
      type: "block",
      blocks: ["core/paragraph"],
      transform: (attributes, innerBlocks = []) => [
        createBlock("core/paragraph", attributes),
        ...innerBlocks.map((block) => cloneBlock(block))
      ]
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
