// packages/block-library/src/post-excerpt/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/post-content"],
      transform: () => createBlock("core/post-excerpt")
    }
  ],
  to: [
    {
      type: "block",
      blocks: ["core/post-content"],
      transform: () => createBlock("core/post-content")
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
