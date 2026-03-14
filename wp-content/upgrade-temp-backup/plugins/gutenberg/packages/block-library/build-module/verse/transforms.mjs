// packages/block-library/src/verse/transforms.js
import { createBlock } from "@wordpress/blocks";
var transforms = {
  from: [
    {
      type: "block",
      blocks: ["core/paragraph"],
      transform: (attributes) => createBlock("core/verse", attributes)
    }
  ],
  to: [
    {
      type: "block",
      blocks: ["core/paragraph"],
      transform: (attributes) => createBlock("core/paragraph", attributes)
    }
  ]
};
var transforms_default = transforms;
export {
  transforms_default as default
};
//# sourceMappingURL=transforms.mjs.map
